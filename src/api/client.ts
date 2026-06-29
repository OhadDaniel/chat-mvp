import { API_BASE_URL, STORAGE_KEY_TOKEN } from '@/shared/constants'

/**
 * Shared HTTP transport. Feature API modules (features/<x>/api/) build
 * their own endpoint surface on top of request() — this layer only knows
 * how to talk to the server, not what any feature's routes are.
 */
export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem(STORAGE_KEY_TOKEN)
  const isFormData = options.body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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
