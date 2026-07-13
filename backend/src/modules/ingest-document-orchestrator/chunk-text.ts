import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { CHUNK_OVERLAP, CHUNK_SIZE } from './ingest-document.constants';
import type { TextChunk } from './ingest-document.types';

export async function chunkText(text: string): Promise<TextChunk[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });
  const pieces = await splitter.splitText(text);
  return pieces.map((piece, index) => ({ chunkIndex: index, text: piece }));
}
