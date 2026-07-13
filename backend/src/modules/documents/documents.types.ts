import { DOCUMENT_STATUSES } from './documents.constants';

export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export type StoredDocument = {
  id: string;
  userId: string;
  tutorId: string;
  source: string;
  contentHash: string | null;
  status: DocumentStatus;
  chunkCount: number;
  createdAt: string;
};

export type DocumentLean = {
  _id: string;
  userId: string;
  tutorId: string;
  source: string;
  contentHash: string | null;
  status: string;
  chunkCount: number;
  createdAt: Date;
};

export type DocumentSummary = {
  id: string;
  source: string;
  status: DocumentStatus;
  chunkCount: number;
  createdAt: string;
};

export type IngestDocumentResponse = {
  document: DocumentSummary;
};

export type ListDocumentsResponse = {
  documents: DocumentSummary[];
};
