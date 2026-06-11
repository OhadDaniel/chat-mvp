import { API_BASE_URL, MESSAGES_PAGE_SIZE, STORAGE_KEY_TOKEN } from '@/shared/constants'
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  MeResponse,
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
  const token = localStorage.getItem(STORAGE_KEY_TOKEN)

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  // expired/invalid token mid-session: clear it and restart at the login screen
  if (response.status === 401 && token && !path.startsWith('/auth/')) {
    localStorage.removeItem(STORAGE_KEY_TOKEN)
    window.location.reload()
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new ApiRequestError(response.status, body.error?.code ?? 'UNKNOWN_ERROR')
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

  signup: (body: SignupRequest): Promise<SignupResponse> =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  me: (): Promise<MeResponse> => request('/me'),
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

}
