import type { DocumentSummary, StoredDocument } from './documents.types';

export function toDocumentSummary(document: StoredDocument): DocumentSummary {
  return {
    id: document.id,
    source: document.source,
    status: document.status,
    chunkCount: document.chunkCount,
    createdAt: document.createdAt,
  };
}
