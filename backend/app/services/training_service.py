import asyncio
import logging
from typing import List, Dict, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from langchain.text_splitter import RecursiveCharacterTextSplitter
from ..models.widget import Widget, TrainingDocument, TrainingStatus
from ..services.vector_store import vector_store_service
from ..services.cache_service import cache_service
from ..core.config import settings
from ..core.exceptions import TrainingError
from ..utils.document_loaders import DocumentProcessor

logger = logging.getLogger(__name__)


class TrainingService:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.EMBEDDING_CHUNK_SIZE,
            chunk_overlap=settings.EMBEDDING_CHUNK_OVERLAP,
            separators=["\n\n", "\n", ". ", "! ", "? ", ", ", " ", ""],
        )
        self.document_processor = DocumentProcessor()

    async def start_training(
        self,
        widget_id: str,
        training_data: List[Dict],
        db: Session,
        background: bool = True,
    ) -> Dict:
        """Start training process"""
        try:
            # Get widget
            widget = db.query(Widget).filter(Widget.id == widget_id).first()
            if not widget:
                raise TrainingError("Widget not found")

            # Update training status
            widget.training_status = TrainingStatus.IN_PROGRESS
            db.commit()

            if background:
                # Start training in background using asyncio task
                task = asyncio.create_task(
                    self._process_training_data_async(widget_id, training_data, db)
                )

                return {
                    "task_id": str(id(task)),  # Simple task ID
                    "status": "started",
                    "message": "Training started in background",
                    "widget_id": widget_id,
                }
            else:
                # Process synchronously for testing
                success = await self._process_training_data_async(
                    widget_id, training_data, db
                )
                return {
                    "status": "completed" if success else "failed",
                    "message": "Training completed",
                    "widget_id": widget_id,
                }

        except Exception as e:
            logger.error(f"Failed to start training for widget {widget_id}: {e}")
            # Reset training status on error
            try:
                widget = db.query(Widget).filter(Widget.id == widget_id).first()
                if widget:
                    widget.training_status = TrainingStatus.FAILED
                    db.commit()
            except:
                pass
            raise TrainingError(f"Training failed to start: {e}")

    async def _process_training_data_async(
        self, widget_id: str, training_data: List[Dict], db: Session
    ) -> bool:
        """Process training data asynchronously"""
        try:
            widget = db.query(Widget).filter(Widget.id == widget_id).first()
            if not widget:
                raise TrainingError("Widget not found")

            logger.info(
                f"Starting training for widget {widget_id} with {len(training_data)} items"
            )

            all_chunks = []
            all_metadatas = []
            processed_docs = 0

            # Get namespace for this widget
            namespace = vector_store_service.get_namespace(widget.user_id, widget_id)

            # Clear existing cache when retraining
            await cache_service.invalidate_widget_cache(widget_id)

            for data_item in training_data:
                try:
                    chunks, metadatas = await self._process_single_data_item(
                        data_item, widget_id, db
                    )

                    all_chunks.extend(chunks)
                    all_metadatas.extend(metadatas)
                    processed_docs += 1

                    logger.debug(
                        f"Processed document {processed_docs}/{len(training_data)}"
                    )

                except Exception as e:
                    logger.error(f"Failed to process data item: {e}")
                    continue

            if not all_chunks:
                raise TrainingError("No valid training data found")

            logger.info(
                f"Generated {len(all_chunks)} chunks from {processed_docs} documents"
            )

            # Add to vector store in batches
            batch_size = settings.EMBEDDING_BATCH_SIZE
            successful_batches = 0

            for i in range(0, len(all_chunks), batch_size):
                batch_chunks = all_chunks[i : i + batch_size]
                batch_metadatas = all_metadatas[i : i + batch_size]

                success = await vector_store_service.add_documents_async(
                    namespace=namespace,
                    texts=batch_chunks,
                    metadatas=batch_metadatas,
                    document_id=f"batch_{i // batch_size}",
                )

                if success:
                    successful_batches += 1
                    logger.debug(f"Successfully added batch {i // batch_size + 1}")
                else:
                    logger.warning(f"Failed to add batch {i // batch_size + 1}")

            # Consider training successful if at least 80% of batches succeeded
            total_batches = (len(all_chunks) + batch_size - 1) // batch_size
            success_rate = (
                successful_batches / total_batches if total_batches > 0 else 0
            )

            if success_rate < 0.8:
                raise TrainingError(
                    f"Too many batches failed. Success rate: {success_rate:.1%}"
                )

            # Update widget status
            widget.training_status = TrainingStatus.COMPLETED
            widget.total_documents = processed_docs
            widget.total_chunks = len(all_chunks)
            widget.last_training_date = datetime.utcnow()
            db.commit()

            logger.info(
                f"✅ Training completed for widget {widget_id}: {processed_docs} docs, {len(all_chunks)} chunks"
            )
            return True

        except Exception as e:
            logger.error(f"Training failed for widget {widget_id}: {e}")

            # Update widget status to failed
            try:
                widget = db.query(Widget).filter(Widget.id == widget_id).first()
                if widget:
                    widget.training_status = TrainingStatus.FAILED
                    db.commit()
            except Exception as db_error:
                logger.error(f"Failed to update widget status: {db_error}")

            return False

    async def _process_single_data_item(
        self, data_item: Dict, widget_id: str, db: Session
    ) -> tuple:
        """Process a single training data item"""
        content_type = data_item.get("type")
        content = data_item.get("content")
        title = data_item.get("title", "Untitled")

        if not content:
            raise ValueError("No content provided")

        # Save to database first
        training_doc = TrainingDocument(
            widget_id=widget_id,
            title=title,
            content=content[:10000],  # Truncate for storage
            content_type=content_type,
            source_url=data_item.get("source_url"),
            document_metadata=data_item.get("metadata", {}),
        )
        db.add(training_doc)
        db.flush()

        # Process content based on type
        try:
            if content_type == "text":
                chunks = await self._process_text_content(content)
            elif content_type == "url":
                chunks = await self._process_url_content(content)
            elif content_type == "file":
                chunks = await self._process_file_content(
                    content, data_item.get("file_type")
                )
            elif content_type == "faq":
                chunks = await self._process_faq_content(data_item)
            else:
                raise ValueError(f"Unsupported content type: {content_type}")
        except Exception as e:
            logger.error(f"Content processing failed for {title}: {e}")
            # Use original content as fallback
            chunks = await self._process_text_content(content)

        # Create metadata for each chunk
        metadatas = []
        for i, chunk in enumerate(chunks):
            metadata = {
                "document_id": training_doc.id,
                "widget_id": widget_id,
                "content_type": content_type,
                "title": title,
                "chunk_index": i,
                "source_url": data_item.get("source_url", ""),
                "created_at": datetime.utcnow().isoformat(),
                **data_item.get("metadata", {}),
            }
            metadatas.append(metadata)

        # Update document with chunk count
        training_doc.chunk_count = len(chunks)
        training_doc.is_processed = True
        db.commit()

        return chunks, metadatas

    async def _process_text_content(self, content: str) -> List[str]:
        """Process plain text content"""
        if not content or not content.strip():
            return []

        # Clean content
        content = content.strip()

        # Split into chunks
        chunks = self.text_splitter.split_text(content)

        # Filter out very short or empty chunks
        processed_chunks = []
        for chunk in chunks:
            chunk = chunk.strip()
            if len(chunk) >= 50:  # Minimum chunk size
                processed_chunks.append(chunk)

        return processed_chunks

    async def _process_url_content(self, url: str) -> List[str]:
        """Process web page content"""
        try:
            import aiohttp

            async with aiohttp.ClientSession() as session:
                async with session.get(
                    url, timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status == 200:
                        html_content = await response.text()

                        # Extract text from HTML
                        from bs4 import BeautifulSoup

                        soup = BeautifulSoup(html_content, "html.parser")

                        # Remove script and style elements
                        for script in soup(["script", "style"]):
                            script.decompose()

                        # Get text
                        text = soup.get_text()

                        # Clean up text
                        lines = (line.strip() for line in text.splitlines())
                        chunks = (
                            phrase.strip()
                            for line in lines
                            for phrase in line.split("  ")
                        )
                        text = " ".join(chunk for chunk in chunks if chunk)

                        return await self._process_text_content(text)
                    else:
                        raise ValueError(f"HTTP {response.status}: Failed to fetch URL")

        except Exception as e:
            logger.error(f"Failed to process URL {url}: {e}")
            raise ValueError(f"Failed to load content from URL: {e}")

    async def _process_file_content(self, file_path: str, file_type: str) -> List[str]:
        """Process uploaded file content"""
        try:
            content = await self.document_processor.process_file(file_path, file_type)
            return await self._process_text_content(content)
        except Exception as e:
            logger.error(f"Failed to process file {file_path}: {e}")
            raise ValueError(f"Failed to process file: {e}")

    async def _process_faq_content(self, faq_data: Dict) -> List[str]:
        """Process FAQ content"""
        question = faq_data.get("question", "")
        answer = faq_data.get("answer", faq_data.get("content", ""))

        if not question and not answer:
            raise ValueError("FAQ must have question and/or answer")

        # Create comprehensive FAQ text
        if question and answer:
            faq_text = f"Q: {question}\nA: {answer}"
        elif question:
            faq_text = f"Question: {question}"
        else:
            faq_text = f"Answer: {answer}"

        return await self._process_text_content(faq_text)

    async def delete_training_document(
        self, document_id: str, widget_id: str, db: Session
    ) -> bool:
        """Delete a training document and its vectors"""
        try:
            # Get document
            doc = (
                db.query(TrainingDocument)
                .filter(
                    TrainingDocument.id == document_id,
                    TrainingDocument.widget_id == widget_id,
                )
                .first()
            )

            if not doc:
                return False

            # Get widget for namespace
            widget = db.query(Widget).filter(Widget.id == widget_id).first()
            if not widget:
                return False

            # Delete from vector store
            namespace = vector_store_service.get_namespace(widget.user_id, widget_id)
            success = await vector_store_service.delete_document_async(
                namespace, document_id
            )

            if success:
                # Delete from database
                db.delete(doc)

                # Update widget counts
                widget.total_documents = max(0, widget.total_documents - 1)
                widget.total_chunks = max(0, widget.total_chunks - doc.chunk_count)

                # Invalidate cache
                await cache_service.invalidate_widget_cache(widget_id)

                db.commit()
                logger.info(f"Deleted training document {document_id}")
                return True

            return False

        except Exception as e:
            logger.error(f"Failed to delete training document {document_id}: {e}")
            return False

    async def retrain_widget(
        self, widget_id: str, db: Session, clear_existing: bool = True
    ) -> Dict:
        """Retrain widget with existing documents"""
        try:
            widget = db.query(Widget).filter(Widget.id == widget_id).first()
            if not widget:
                raise TrainingError("Widget not found")

            # Get all training documents
            docs = (
                db.query(TrainingDocument)
                .filter(TrainingDocument.widget_id == widget_id)
                .all()
            )

            if not docs:
                raise TrainingError("No training documents found")

            # Clear existing vectors if requested
            if clear_existing:
                namespace = vector_store_service.get_namespace(
                    widget.user_id, widget_id
                )
                await vector_store_service.delete_namespace_async(namespace)

            # Convert documents to training data format
            training_data = []
            for doc in docs:
                training_data.append(
                    {
                        "type": doc.content_type,
                        "content": doc.content,
                        "title": doc.title,
                        "source_url": doc.source_url,
                        "metadata": doc.document_metadata or {},
                    }
                )

            # Start retraining
            return await self.start_training(widget_id, training_data, db)

        except Exception as e:
            logger.error(f"Failed to retrain widget {widget_id}: {e}")
            raise TrainingError(f"Retraining failed: {e}")

    async def get_training_progress(self, widget_id: str, db: Session) -> Dict:
        """Get training progress for a widget"""
        try:
            widget = db.query(Widget).filter(Widget.id == widget_id).first()
            if not widget:
                return {"error": "Widget not found"}

            # Get document counts
            total_docs = (
                db.query(TrainingDocument)
                .filter(TrainingDocument.widget_id == widget_id)
                .count()
            )

            processed_docs = (
                db.query(TrainingDocument)
                .filter(
                    TrainingDocument.widget_id == widget_id,
                    TrainingDocument.is_processed == True,
                )
                .count()
            )

            # Get vector store stats
            namespace = vector_store_service.get_namespace(widget.user_id, widget_id)
            vector_stats = await vector_store_service.get_namespace_stats(namespace)

            progress_percentage = (
                (processed_docs / total_docs * 100) if total_docs > 0 else 0
            )

            return {
                "widget_id": widget_id,
                "status": widget.training_status,
                "total_documents": total_docs,
                "processed_documents": processed_docs,
                "total_chunks": widget.total_chunks,
                "vector_count": vector_stats.get("total_vectors", 0),
                "progress_percentage": round(progress_percentage, 2),
                "last_training_date": widget.last_training_date,
            }

        except Exception as e:
            logger.error(f"Failed to get training progress: {e}")
            return {"error": str(e)}

    async def validate_training_data(self, training_data: List[Dict]) -> Dict:
        """Validate training data before processing"""
        validation_result = {
            "valid": True,
            "errors": [],
            "warnings": [],
            "total_items": len(training_data),
        }

        for i, item in enumerate(training_data):
            item_errors = []

            # Check required fields
            if not item.get("type"):
                item_errors.append("Missing 'type' field")

            if not item.get("content"):
                item_errors.append("Missing 'content' field")

            # Check content type
            content_type = item.get("type")
            if content_type not in ["text", "url", "file", "faq"]:
                item_errors.append(f"Invalid content type: {content_type}")

            # Check content length
            content = item.get("content", "")
            if len(content) < 10:
                item_errors.append("Content too short (minimum 10 characters)")
            elif len(content) > 100000:
                validation_result["warnings"].append(
                    f"Item {i}: Content very long ({len(content)} chars)"
                )

            # URL-specific validation
            if content_type == "url":
                if not content.startswith(("http://", "https://")):
                    item_errors.append("URL must start with http:// or https://")

            # FAQ-specific validation
            if content_type == "faq":
                if not item.get("question") and not item.get("answer"):
                    item_errors.append("FAQ must have question and/or answer")

            if item_errors:
                validation_result["errors"].append(
                    {"item_index": i, "errors": item_errors}
                )

        validation_result["valid"] = len(validation_result["errors"]) == 0

        return validation_result


# Global instance
training_service = TrainingService()
