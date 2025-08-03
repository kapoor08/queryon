# Updated imports for the new Pinecone package
from pinecone import Pinecone, ServerlessSpec
from typing import List, Dict, Optional, Tuple
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor
import time
import numpy as np
from sentence_transformers import SentenceTransformer
from ..core.config import settings
from ..core.exceptions import VectorStoreError

logger = logging.getLogger(__name__)


class VectorStoreService:
    def __init__(self):
        self.pc = None
        self.index = None
        self.embedding_model = None
        self.executor = ThreadPoolExecutor(max_workers=5)
        self.initialize_pinecone()

    def initialize_pinecone(self):
        """Initialize Pinecone connection and check if index exists"""
        try:
            # Initialize Pinecone with new client (v5+)
            self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)

            # Check if index exists
            existing_indexes = [index.name for index in self.pc.list_indexes()]

            if settings.PINECONE_INDEX_NAME not in existing_indexes:
                logger.warning(f"Index '{settings.PINECONE_INDEX_NAME}' not found.")
                logger.warning("Available indexes: %s", existing_indexes)
                logger.warning("Please create the index manually in Pinecone console:")
                logger.warning(f"  - Name: {settings.PINECONE_INDEX_NAME}")
                logger.warning(f"  - Dimensions: {settings.PINECONE_DIMENSION}")
                logger.warning("  - Metric: cosine")
                logger.warning("  - Cloud: AWS")
                logger.warning("  - Region: us-east-1")
                return

            # Get index reference
            self.index = self.pc.Index(settings.PINECONE_INDEX_NAME)
            logger.info(
                f"✅ Pinecone index '{settings.PINECONE_INDEX_NAME}' connected successfully!"
            )

        except Exception as e:
            logger.error(f"Failed to initialize Pinecone: {e}")
            logger.warning("Vector search will be disabled")

    def get_embedding_model(self) -> SentenceTransformer:
        """Get or load the embedding model"""
        if self.embedding_model is None:
            try:
                logger.info(f"Loading embedding model: {settings.EMBEDDING_MODEL}")
                self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
                logger.info("✅ Embedding model loaded successfully!")
            except Exception as e:
                logger.error(f"Failed to load embedding model: {e}")
                raise VectorStoreError(f"Failed to load embedding model: {e}")
        return self.embedding_model

    def get_namespace(self, user_id: str, widget_id: str) -> str:
        """Generate unique namespace for user's widget"""
        return f"user_{user_id}_widget_{widget_id}"

    async def add_documents_async(
        self, namespace: str, texts: List[str], metadatas: List[Dict], document_id: str
    ) -> bool:
        """Add documents to vector store asynchronously"""
        if not self.index:
            logger.warning("Pinecone index not available, skipping vector store")
            return False

        loop = asyncio.get_event_loop()

        try:
            # Run embedding and upload in thread pool
            result = await loop.run_in_executor(
                self.executor,
                self._add_documents_sync,
                namespace,
                texts,
                metadatas,
                document_id,
            )
            return result

        except Exception as e:
            logger.error(f"Failed to add documents to namespace {namespace}: {e}")
            return False

    def _add_documents_sync(
        self, namespace: str, texts: List[str], metadatas: List[Dict], document_id: str
    ) -> bool:
        """Synchronous document addition"""
        try:
            if not self.index:
                return False

            # Get embedding model
            model = self.get_embedding_model()

            # Generate embeddings
            embeddings = model.encode(texts, convert_to_tensor=False)

            # Prepare vectors for upsert
            vectors = []
            for i, (text, metadata, embedding) in enumerate(
                zip(texts, metadatas, embeddings)
            ):
                # Add document_id to metadata for easy deletion
                metadata.update(
                    {
                        "document_id": document_id,
                        "namespace": namespace,
                        "text_content": text[
                            :1000
                        ],  # Store first 1000 chars for reference
                        "chunk_index": i,
                    }
                )

                # Create unique vector ID
                vector_id = f"{document_id}_chunk_{i}"

                vectors.append(
                    {
                        "id": vector_id,
                        "values": embedding.tolist(),
                        "metadata": metadata,
                    }
                )

            # Upsert vectors in batches
            batch_size = 100
            for i in range(0, len(vectors), batch_size):
                batch = vectors[i : i + batch_size]
                self.index.upsert(vectors=batch, namespace=namespace)
                logger.debug(
                    f"Upserted batch {i//batch_size + 1} to namespace {namespace}"
                )

            logger.info(f"✅ Added {len(texts)} chunks to namespace {namespace}")
            return True

        except Exception as e:
            logger.error(f"Sync document addition failed: {e}")
            return False

    async def search_similar_async(
        self, namespace: str, query: str, k: int = None, score_threshold: float = 0.7
    ) -> List[Tuple[str, float, Dict]]:
        """Search for similar documents asynchronously"""
        if not self.index:
            logger.warning("Pinecone index not available, returning empty results")
            return []

        k = k or settings.VECTOR_SEARCH_TOP_K
        loop = asyncio.get_event_loop()

        try:
            result = await loop.run_in_executor(
                self.executor,
                self._search_similar_sync,
                namespace,
                query,
                k,
                score_threshold,
            )
            return result

        except Exception as e:
            logger.error(f"Search failed for namespace {namespace}: {e}")
            return []

    def _search_similar_sync(
        self, namespace: str, query: str, k: int, score_threshold: float
    ) -> List[Tuple[str, float, Dict]]:
        """Synchronous similarity search"""
        try:
            if not self.index:
                return []

            # Get embedding model and encode query
            model = self.get_embedding_model()
            query_embedding = model.encode([query])[0]

            # Search in Pinecone
            search_response = self.index.query(
                vector=query_embedding.tolist(),
                top_k=k,
                namespace=namespace,
                include_metadata=True,
                include_values=False,
            )

            # Process results
            results = []
            for match in search_response.matches:
                score = match.score

                # Only include results above threshold
                if score >= score_threshold:
                    metadata = match.metadata or {}
                    text_content = metadata.get("text_content", "")

                    # Remove internal metadata before returning
                    clean_metadata = {
                        k: v
                        for k, v in metadata.items()
                        if k not in ["text_content", "namespace"]
                    }

                    results.append((text_content, score, clean_metadata))

            logger.debug(
                f"Found {len(results)} similar documents for query in namespace {namespace}"
            )
            return results

        except Exception as e:
            logger.error(f"Sync search failed: {e}")
            return []

    async def delete_document_async(self, namespace: str, document_id: str) -> bool:
        """Delete all vectors for a specific document"""
        if not self.index:
            logger.warning("Pinecone index not available, skipping deletion")
            return False

        loop = asyncio.get_event_loop()

        try:
            result = await loop.run_in_executor(
                self.executor, self._delete_document_sync, namespace, document_id
            )
            return result

        except Exception as e:
            logger.error(
                f"Failed to delete document {document_id} from namespace {namespace}: {e}"
            )
            return False

    def _delete_document_sync(self, namespace: str, document_id: str) -> bool:
        """Synchronous document deletion"""
        try:
            if not self.index:
                return False

            # Delete by metadata filter
            self.index.delete(filter={"document_id": document_id}, namespace=namespace)

            logger.info(f"✅ Deleted document {document_id} from namespace {namespace}")
            return True

        except Exception as e:
            logger.error(f"Sync document deletion failed: {e}")
            return False

    async def delete_namespace_async(self, namespace: str) -> bool:
        """Delete entire namespace"""
        if not self.index:
            return False

        loop = asyncio.get_event_loop()

        try:
            result = await loop.run_in_executor(
                self.executor, self._delete_namespace_sync, namespace
            )
            return result

        except Exception as e:
            logger.error(f"Failed to delete namespace {namespace}: {e}")
            return False

    def _delete_namespace_sync(self, namespace: str) -> bool:
        """Synchronous namespace deletion"""
        try:
            if not self.index:
                return False

            # Delete all vectors in namespace
            self.index.delete(delete_all=True, namespace=namespace)

            logger.info(f"✅ Deleted namespace {namespace}")
            return True

        except Exception as e:
            logger.error(f"Sync namespace deletion failed: {e}")
            return False

    async def get_namespace_stats(self, namespace: str) -> Dict:
        """Get statistics for a namespace"""
        if not self.index:
            return {"total_vectors": 0, "dimension": 0}

        loop = asyncio.get_event_loop()

        try:
            result = await loop.run_in_executor(
                self.executor, self._get_namespace_stats_sync, namespace
            )
            return result

        except Exception as e:
            logger.error(f"Failed to get stats for namespace {namespace}: {e}")
            return {"total_vectors": 0, "dimension": 0}

    def _get_namespace_stats_sync(self, namespace: str) -> Dict:
        """Get namespace statistics synchronously"""
        try:
            if not self.index:
                return {"total_vectors": 0, "dimension": 0}

            stats = self.index.describe_index_stats()

            namespace_stats = stats.get("namespaces", {}).get(namespace, {})

            return {
                "total_vectors": namespace_stats.get("vector_count", 0),
                "dimension": stats.get("dimension", settings.PINECONE_DIMENSION),
                "index_fullness": stats.get("index_fullness", 0.0),
            }

        except Exception as e:
            logger.error(f"Failed to get namespace stats: {e}")
            return {"total_vectors": 0, "dimension": 0}

    async def health_check(self) -> bool:
        """Check if vector store is healthy"""
        try:
            if not self.index:
                return False

            # Simple health check
            stats = self.index.describe_index_stats()
            return True

        except Exception as e:
            logger.error(f"Vector store health check failed: {e}")
            return False

    def create_index_if_not_exists(self, dimension: int = None) -> bool:
        """Create Pinecone index if it doesn't exist"""
        try:
            dimension = dimension or settings.PINECONE_DIMENSION

            # Check if index exists
            existing_indexes = [index.name for index in self.pc.list_indexes()]

            if settings.PINECONE_INDEX_NAME in existing_indexes:
                logger.info(f"Index {settings.PINECONE_INDEX_NAME} already exists")
                return True

            # Create new index
            self.pc.create_index(
                name=settings.PINECONE_INDEX_NAME,
                dimension=dimension,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )

            # Wait for index to be ready
            import time

            while not self.pc.describe_index(settings.PINECONE_INDEX_NAME).status[
                "ready"
            ]:
                time.sleep(1)

            # Update index reference
            self.index = self.pc.Index(settings.PINECONE_INDEX_NAME)

            logger.info(f"✅ Created index {settings.PINECONE_INDEX_NAME}")
            return True

        except Exception as e:
            logger.error(f"Failed to create index: {e}")
            return False


# Global instance
vector_store_service = VectorStoreService()
