export type KnowledgeChunkInput = {
  userId: string;
  tutorId: string;
  docId: string;
  source: string;
  chunkIndex: number;
  text: string;
  embedding: number[];
};

export type StoredKnowledgeChunk = {
  id: string;
  userId: string;
  tutorId: string;
  docId: string;
  source: string;
  chunkIndex: number;
  text: string;
};

export type RetrievedChunk = {
  id: string;
  docId: string;
  source: string;
  chunkIndex: number;
  text: string;
  score: number;
};
