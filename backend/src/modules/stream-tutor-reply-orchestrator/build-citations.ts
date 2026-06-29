import type { RetrievedChunk } from '../knowledge/knowledge.types';
import type { Citation } from '../messages/messages.types';

export function buildCitations(chunks: RetrievedChunk[]): Citation[] {
  return chunks.map((chunk) => ({
    chunkId: chunk.id,
    documentName: chunk.source,
    text: chunk.text,
  }));
}
