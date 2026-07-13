import type { MessageContent } from '@langchain/core/messages';
import type { RetrievedChunk } from '../knowledge/knowledge.types';
import type { Citation } from '../messages/messages.types';

export function buildCitations(chunks: RetrievedChunk[]): Citation[] {
  return chunks.map((chunk) => ({
    chunkId: chunk.id,
    documentName: chunk.source,
    text: chunk.text,
  }));
}

export function extractMessageText(content: MessageContent): string {
  if (typeof content === 'string') {
    return content;
  }
  return content
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('');
}
