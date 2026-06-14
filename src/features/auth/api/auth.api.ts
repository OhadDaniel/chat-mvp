import { request } from '@/api/client'
import type { User } from '@/features/user/types'

export type LoginRequest = {
  email:    string
  password: string
}

export type LoginResponse = {
  token: string
  user: User
}

export type SignupRequest = {
  email:    string
  password: string
  name:     string
}

export type SignupResponse = {
  token: string
  user: User
}

export type MeResponse = {
  user: User
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
