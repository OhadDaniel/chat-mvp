import { request } from '@/api/client'
import type {
  GetConversationsResponse,
  ConversationResponse,
  CreateDirectRequest,
  CreateGroupRequest,
  RenameGroupRequest,
  PatchConversationRequest,
  RequestGroupAvatarUploadRequest,
  RequestGroupAvatarUploadResponse,
} from './conversations.types'

export const conversationsApi = {
  getAll: (search?: string): Promise<GetConversationsResponse> => {
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    return request(`/conversations${params}`)
  },

  createDirect: (body: CreateDirectRequest): Promise<ConversationResponse> =>
    request('/conversations', {
      method: 'POST',
      body: JSON.stringify({ type: 'direct', ...body }),
    }),

  createGroup: (body: CreateGroupRequest): Promise<ConversationResponse> =>
    request('/conversations', {
      method: 'POST',
      body: JSON.stringify({ type: 'group', ...body }),
    }),

  createAssistant: (): Promise<ConversationResponse> =>
    request('/conversations', {
      method: 'POST',
      body: JSON.stringify({ type: 'assistant' }),
    }),

  renameGroup: (
    id: string,
    body: RenameGroupRequest,
  ): Promise<ConversationResponse> =>
    request(`/conversations/groups/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  patch: (
    id: string,
    body: PatchConversationRequest,
  ): Promise<ConversationResponse> =>
    request(`/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  requestGroupAvatarUpload: (
    id: string,
    body: RequestGroupAvatarUploadRequest,
  ): Promise<RequestGroupAvatarUploadResponse> =>
    request(`/conversations/groups/${id}/avatar/upload-url`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  setGroupAvatar: (id: string): Promise<ConversationResponse> =>
    request(`/conversations/groups/${id}/avatar`, {
      method: 'PUT',
    }),

  removeGroupAvatar: (id: string): Promise<ConversationResponse> =>
    request(`/conversations/groups/${id}/avatar`, {
      method: 'DELETE',
    }),
}
