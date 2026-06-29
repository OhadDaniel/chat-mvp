export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'VALIDATION_ERROR'
  | 'USER_NOT_FOUND'
  | 'CONVERSATION_NOT_FOUND'
  | 'CONVERSATION_ALREADY_EXISTS'
  | 'INVALID_PARTICIPANT'
  | 'NOT_A_PARTICIPANT'
  | 'INVALID_AVATAR_KEY'
  | 'INTERNAL_SERVER_ERROR'

export type ApiError = {
  error: {
    code:     ApiErrorCode
    message:  string
    details?: unknown
  }
}

export type KnowledgeDocumentStatus = 'pending' | 'ready' | 'failed'

export type KnowledgeDocument = {
  id: string
  source: string
  status: KnowledgeDocumentStatus
  chunkCount: number
  createdAt: string
}

export type ListDocumentsResponse = {
  documents: KnowledgeDocument[]
}

export type UploadDocumentResponse = {
  document: KnowledgeDocument
}
