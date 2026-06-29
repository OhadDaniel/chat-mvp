export const DOCUMENTS_COLLECTION = 'documents';

export const MAX_DOCUMENTS_PER_TUTOR = 50;

export const DOCUMENT_STATUS_PENDING = 'pending';

export const DOCUMENT_STATUS_READY = 'ready';

export const DOCUMENT_STATUS_FAILED = 'failed';

export const DOCUMENT_STATUSES = [
  DOCUMENT_STATUS_PENDING,
  DOCUMENT_STATUS_READY,
  DOCUMENT_STATUS_FAILED,
] as const;
