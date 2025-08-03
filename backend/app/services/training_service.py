import asyncio
import logging
from typing import List, Dict, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import TextLoader, PyPDFLoader, UnstructuredWordDocumentLoader
from langchain.document_loaders.web_base import WebBaseLoader
from ..models.widget import Widget, TrainingDocument, TrainingStatus
from ..services.vector_store import vector_store_service
from ..core.config import settings
from ..core.exceptions import TrainingError
from ..utils.document_loaders import DocumentProcessor
from ..tasks.training_tasks import process_training_data_task

logger = logging.getLogger(__name__)

class TrainingService:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.EMBEDDING_CHUNK_SIZE,
            chunk_overlap=settings.EMBEDDING_CHUNK_OVERLAP,
            separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""]
        )
        self.document_processor = DocumentProcessor()
    
    async def start_training(
        self,
        widget_id: str,
        training_data: List[Dict],
        db: Session
    ) -> Dict:
        """Start training process asynchronously"""
        try:
            # Get widget
            widget = db.query(Widget).filter(Widget.id == widget_id).first()
            if not widget:
                raise TrainingError("Widget not found")
            
            # Update training status
            widget.training_status = TrainingStatus.IN_PROGRESS
            db.commit()
            
            # Process training data asynchronously using Celery
            task = process_training_data_task.delay(
                widget_id=widget_id,
                training_data=training_data
            )
            
            return {
                "task_id": task.id,
                "status": "started",
                "message": "Training started in background"
            }
            
        except Exception as e:
            logger.error(f"Failed to start training for widget {widget_id}: {e}")
            # Reset training status on error
            widget = db.query(Widget).filter(Widget.id == widget_id).first()
            if widget:
                widget.training_status = TrainingStatus.FAILED
                db.commit()
            raise TrainingError(f"Training failed to start: {e}")
    
    async def process_training_data_sync(
        self,
        widget_id: str,
        training_data: List[Dict],
        db: Session
    ) -> bool:
        """Process training data synchronously (called by Celery task)"""
        try:
            widget = db.query(Widget).filter(Widget.id == widget_id).first()
            if not widget:
                raise TrainingError("Widget not found")
            
            all_chunks = []
            all_metadatas = []
            processed_docs = 0
            
            # Get namespace for this widget
            namespace = vector_store_service.get_namespace(widget.user_id, widget_id)
            
            for data_item in training_data:
                try:
                    chunks, metadatas = await self._process_single_data_item(
                        data_item, widget_id, db
                    )
                    
                    all_chunks.extend(chunks)
                    all_metadatas.extend(metadatas)
                    processed_docs += 1
                    
                except Exception as e:
                    logger.error(f"Failed to process data item: {e}")
                    continue
            
            if not all_chunks:
                raise TrainingError("No valid training data found")
            
            # Add to vector store in batches
            batch_size = settings.EMBEDDING_BATCH_SIZE
            for i in range(0, len(all_chunks), batch_size):
                batch_chunks = all_chunks[i:i + batch_size]
                batch_metadatas = all_metadatas[i:i + batch_size]
                
                success = await vector_store_service.add_documents_async(
                    namespace=namespace,
                    texts=batch_chunks,
                    metadatas=batch_metadatas,
                    document_id=f"batch_{i // batch_size}"
                )
                
                if not success:
                    raise TrainingError(f"Failed to add batch {i // batch_size} to vector store")
            
            # Update widget status
            widget.training_status = TrainingStatus.COMPLETED
            widget.total_documents = processed_docs
            widget.total_chunks = len(all_chunks)
            widget.last_training_date = datetime.utcnow()
            db.commit()
            
            logger.info(f"Training completed for widget {widget_id}: {processed_docs} docs, {len(all_chunks)} chunks")
            return True
            
        except Exception as e:
            logger.error(f"Training failed for widget {widget_id}: {e}")
            
            # Update widget status to failed
            widget = db.query(Widget).filter(Widget.id == widget_id).first()
            if widget:
                widget.training_status = TrainingStatus.FAILED
                db.commit()
            
            return False
    
    async def _process_single_data_item(
    self,
    data_item: Dict,
    widget_id: str,
    db: Session
) -> tuple:
        """Process a single training data item"""
        content_type = data_item.get("type")
        content = data_item.get("content")
        title = data_item.get("title", "Untitled")
        
        if not content:
            raise ValueError("No content provided")
        
        # Save to database
        training_doc = TrainingDocument(
            widget_id=widget_id,
            title=title,
            content=content[:10000],  # Truncate for storage
            content_type=content_type,
            source_url=data_item.get("source_url"),
            document_metadata=data_item.get("metadata", {})  # Changed from 'metadata' to 'document_metadata'
        )
        db.add(training_doc)
        db.flush()
        
        # Process content based on type
        if content_type == "text":
            chunks = await self._process_text_content(content)
        elif content_type == "url":
            chunks = await self._process_url_content(content)
        elif content_type == "file":
            chunks = await self._process_file_content(content, data_item.get("file_type"))
        elif content_type == "faq":
            chunks = await self._process_faq_content(data_item)
        else:
            raise ValueError(f"Unsupported content type: {content_type}")
        
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
                **data_item.get("metadata", {})
            }
            metadatas.append(metadata)
        
        # Update document with chunk count
        training_doc.chunk_count = len(chunks)
        training_doc.is_processed = True
        db.commit()
        
        return chunks, metadatas
    
    async def _process_text_content(self, content: str) -> List[str]:
        """Process plain text content"""
        chunks = self.text_splitter.split_text(content)
        return [chunk.strip() for chunk in chunks if chunk.strip()]
    
    async def _process_url_content(self, url: str) -> List[str]:
        """Process web page content"""
        try:
            loader = WebBaseLoader(url)
            documents = loader.load()
            
            all_chunks = []
            for doc in documents:
                chunks = self.text_splitter.split_text(doc.page_content)
                all_chunks.extend([chunk.strip() for chunk in chunks if chunk.strip()])
            
            return all_chunks
        except Exception as e:
            logger.error(f"Failed to process URL {url}: {e}")
            raise ValueError(f"Failed to load content from URL: {e}")
    
    async def _process_file_content(self, file_path: str, file_type: str) -> List[str]:
        """Process uploaded file content"""
        try:
            content = await self.document_processor.process_file(file_path, file_type)
            chunks = self.text_splitter.split_text(content)
            return [chunk.strip() for chunk in chunks if chunk.strip()]
        except Exception as e:
            logger.error(f"Failed to process file {file_path}: {e}")
            raise ValueError(f"Failed to process file: {e}")
    
    async def _process_faq_content(self, faq_data: Dict) -> List[str]:
        """Process FAQ content"""
        question = faq_data.get("question", "")
        answer = faq_data.get("answer", "")
        
        if not question or not answer:
            raise ValueError("FAQ must have both question and answer")
        
        # Combine question and answer for better context
        faq_text = f"Q: {question}\nA: {answer}"
        
        chunks = self.text_splitter.split_text(faq_text)
        return [chunk.strip() for chunk in chunks if chunk.strip()]
    
    async def delete_training_document(
        self,
        document_id: str,
        widget_id: str,
        db: Session
    ) -> bool:
        """Delete a training document and its vectors"""
        try:
            # Get document
            doc = db.query(TrainingDocument).filter(
                TrainingDocument.id == document_id,
                TrainingDocument.widget_id == widget_id
            ).first()
            
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
                widget.total_documents -= 1
                widget.total_chunks -= doc.chunk_count
                
                db.commit()
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Failed to delete training document {document_id}: {e}")
            return False

# Global instance
training_service = TrainingService()