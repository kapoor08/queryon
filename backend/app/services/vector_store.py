import pinecone
from typing import List, Dict, Optional, Tuple
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor
from ..core.config import settings
from ..core.exceptions import VectorStoreError

# Updated imports to fix deprecation warnings
try:
    from langchain_community.vectorstores import Pinecone
    from langchain_community.embeddings import OllamaEmbeddings
except ImportError:
    # Fallback to old imports if new ones aren't available
    from langchain.vectorstores import Pinecone
    from langchain.embeddings import OllamaEmbeddings

logger = logging.getLogger(__name__)

class VectorStoreService:
    def __init__(self):
        self.initialize_pinecone()
        
        # Use Ollama embeddings since you're using Ollama
        self.embeddings = OllamaEmbeddings(
            base_url=settings.OLLAMA_BASE_URL,
            model=settings.OLLAMA_EMBEDDING_MODEL
        )
        
        self.executor = ThreadPoolExecutor(max_workers=5)
        
    def initialize_pinecone(self):
        """Initialize Pinecone connection and check if index exists"""
        try:
            pinecone.init(
                api_key=settings.PINECONE_API_KEY,
                environment=settings.PINECONE_ENVIRONMENT
            )
            
            # Check if index exists (don't try to create)
            available_indexes = pinecone.list_indexes()
            if settings.PINECONE_INDEX_NAME not in available_indexes:
                logger.warning(f"Index '{settings.PINECONE_INDEX_NAME}' not found. Available indexes: {available_indexes}")
                logger.warning("Please create the index manually in Pinecone console with:")
                logger.warning(f"  - Name: {settings.PINECONE_INDEX_NAME}")
                logger.warning(f"  - Dimensions: {settings.PINECONE_DIMENSION}")
                logger.warning("  - Metric: cosine")
                logger.warning("  - Pod Type: Starter (free tier)")
                # Don't raise error, just warn
            else:
                logger.info(f"Pinecone index '{settings.PINECONE_INDEX_NAME}' found and ready!")
                
        except Exception as e:
            logger.error(f"Failed to initialize Pinecone: {e}")
            # For now, just log the error instead of raising
            logger.warning("Pinecone initialization failed, but continuing...")
    
    def get_namespace(self, user_id: str, widget_id: str) -> str:
        """Generate unique namespace for user's widget"""
        return f"user_{user_id}_widget_{widget_id}"
    
    async def add_documents_async(
        self, 
        namespace: str, 
        texts: List[str], 
        metadatas: List[Dict],
        document_id: str
    ) -> bool:
        """Add documents to vector store asynchronously"""
        loop = asyncio.get_event_loop()
        
        try:
            # Run embedding and upload in thread pool
            result = await loop.run_in_executor(
                self.executor,
                self._add_documents_sync,
                namespace,
                texts,
                metadatas,
                document_id
            )
            return result
            
        except Exception as e:
            logger.error(f"Failed to add documents to namespace {namespace}: {e}")
            return False  # Return False instead of raising
    
    def _add_documents_sync(
        self, 
        namespace: str, 
        texts: List[str], 
        metadatas: List[Dict],
        document_id: str
    ) -> bool:
        """Synchronous document addition"""
        try:
            # Check if index exists before trying to use it
            if settings.PINECONE_INDEX_NAME not in pinecone.list_indexes():
                logger.error(f"Index {settings.PINECONE_INDEX_NAME} does not exist")
                return False
            
            # Add document_id to all metadatas for easy deletion
            for metadata in metadatas:
                metadata["document_id"] = document_id
                metadata["namespace"] = namespace
            
            # Create vector store with namespace
            vectorstore = Pinecone.from_texts(
                texts=texts,
                embedding=self.embeddings,
                index_name=settings.PINECONE_INDEX_NAME,
                namespace=namespace,
                metadatas=metadatas
            )
            
            logger.info(f"Added {len(texts)} chunks to namespace {namespace}")
            return True
            
        except Exception as e:
            logger.error(f"Sync document addition failed: {e}")
            return False
    
    async def search_similar_async(
        self, 
        namespace: str, 
        query: str, 
        k: int = None
    ) -> List[Tuple[str, float, Dict]]:
        """Search for similar documents asynchronously"""
        k = k or settings.VECTOR_SEARCH_TOP_K
        loop = asyncio.get_event_loop()
        
        try:
            result = await loop.run_in_executor(
                self.executor,
                self._search_similar_sync,
                namespace,
                query,
                k
            )
            return result
            
        except Exception as e:
            logger.error(f"Search failed for namespace {namespace}: {e}")
            return []
    
    def _search_similar_sync(
        self, 
        namespace: str, 
        query: str, 
        k: int
    ) -> List[Tuple[str, float, Dict]]:
        """Synchronous similarity search"""
        try:
            # Check if index exists
            if settings.PINECONE_INDEX_NAME not in pinecone.list_indexes():
                logger.error(f"Index {settings.PINECONE_INDEX_NAME} does not exist")
                return []
                
            vectorstore = Pinecone.from_existing_index(
                index_name=settings.PINECONE_INDEX_NAME,
                embedding=self.embeddings,
                namespace=namespace
            )
            
            # Get documents with scores
            docs_with_scores = vectorstore.similarity_search_with_score(
                query=query, 
                k=k
            )
            
            # Return as list of tuples (content, score, metadata)
            results = [
                (doc.page_content, score, doc.metadata)
                for doc, score in docs_with_scores
            ]
            
            logger.debug(f"Found {len(results)} similar documents for query in namespace {namespace}")
            return results
            
        except Exception as e:
            logger.error(f"Sync search failed: {e}")
            return []
    
    async def delete_document_async(self, namespace: str, document_id: str) -> bool:
        """Delete all vectors for a specific document"""
        loop = asyncio.get_event_loop()
        
        try:
            result = await loop.run_in_executor(
                self.executor,
                self._delete_document_sync,
                namespace,
                document_id
            )
            return result
            
        except Exception as e:
            logger.error(f"Failed to delete document {document_id} from namespace {namespace}: {e}")
            return False
    
    def _delete_document_sync(self, namespace: str, document_id: str) -> bool:
        """Synchronous document deletion"""
        try:
            if settings.PINECONE_INDEX_NAME not in pinecone.list_indexes():
                logger.error(f"Index {settings.PINECONE_INDEX_NAME} does not exist")
                return False
                
            index = pinecone.Index(settings.PINECONE_INDEX_NAME)
            
            # Delete by metadata filter
            index.delete(
                filter={"document_id": document_id},
                namespace=namespace
            )
            
            logger.info(f"Deleted document {document_id} from namespace {namespace}")
            return True
            
        except Exception as e:
            logger.error(f"Sync document deletion failed: {e}")
            return False
    
    async def get_namespace_stats(self, namespace: str) -> Dict:
        """Get statistics for a namespace"""
        loop = asyncio.get_event_loop()
        
        try:
            result = await loop.run_in_executor(
                self.executor,
                self._get_namespace_stats_sync,
                namespace
            )
            return result
            
        except Exception as e:
            logger.error(f"Failed to get stats for namespace {namespace}: {e}")
            return {"total_vectors": 0, "dimension": 0}
    
    def _get_namespace_stats_sync(self, namespace: str) -> Dict:
        """Get namespace statistics synchronously"""
        try:
            if settings.PINECONE_INDEX_NAME not in pinecone.list_indexes():
                return {"total_vectors": 0, "dimension": 0}
                
            index = pinecone.Index(settings.PINECONE_INDEX_NAME)
            stats = index.describe_index_stats()
            
            namespace_stats = stats.get("namespaces", {}).get(namespace, {})
            
            return {
                "total_vectors": namespace_stats.get("vector_count", 0),
                "dimension": stats.get("dimension", 0)
            }
            
        except Exception as e:
            logger.error(f"Failed to get namespace stats: {e}")
            return {"total_vectors": 0, "dimension": 0}

# Global instance
vector_store_service = VectorStoreService()