import { API_BASE_URL, MESSAGES_PAGE_SIZE } from '@/shared/constants'
import type {
  LoginRequest,
  LoginResponse,
  GetConversationsResponse,
  PatchConversationRequest,
  PatchConversationResponse,
  GetMessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
} from './types'



async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('chat_token')

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new ApiRequestError(response.status, body.error ?? 'UNKNOWN_ERROR')
  }


  if (response.status === 204) return {} as T

  return response.json() as Promise<T>
}



export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
  ) {
    super(`API error ${status}: ${code}`)
    this.name = 'ApiRequestError'
  }
}


export const authApi = {
  login: (body: LoginRequest): Promise<LoginResponse> =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}



export const conversationsApi = {
  getAll: (search?: string): Promise<GetConversationsResponse> => {
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    return request(`/conversations${params}`)
  },

  patch: (
    id: string,
    body: PatchConversationRequest,
  ): Promise<PatchConversationResponse> =>
    request(`/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
}



export const messagesApi = {
  getPage: (
    conversationId: string,
    cursor?: string,
  ): Promise<GetMessagesResponse> => {
    const params = new URLSearchParams()
    if (cursor) params.set('cursor', cursor)
    params.set('limit', String(MESSAGES_PAGE_SIZE))
    return request(`/conversations/${conversationId}/messages?${params}`)
  },

  send: (
    conversationId: string,
    body: SendMessageRequest,
  ): Promise<SendMessageResponse> =>
    request(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  delete: (conversationId: string, messageId: string): Promise<void> =>
    request(`/conversations/${conversationId}/messages/${messageId}`, {
      method: 'DELETE',
    }),
}
