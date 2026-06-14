/**
 * Shared transport-level types. Per-feature request/response shapes now
 * live beside their feature (features/<x>/api/); only the cross-cutting
 * error contract stays here.
 */
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
  | 'INTERNAL_SERVER_ERROR'

export type ApiError = {
  error: {
    code:     ApiErrorCode
    message:  string
    details?: unknown
  }
}
