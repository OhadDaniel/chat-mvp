import { request } from './client'
import type {
  ListDocumentsResponse,
  UploadDocumentResponse,
} from './types'

export const knowledgeApi = {
  list: (tutorId: string): Promise<ListDocumentsResponse> =>
    request(`/knowledge/documents?tutorId=${encodeURIComponent(tutorId)}`),

  upload: (tutorId: string, file: File): Promise<UploadDocumentResponse> => {
    const form = new FormData()
    form.append('tutorId', tutorId)
    form.append('file', file)
    return request('/knowledge/documents', { method: 'POST', body: form })
  },

  remove: (documentId: string): Promise<void> =>
    request(`/knowledge/documents/${documentId}`, { method: 'DELETE' }),
}
