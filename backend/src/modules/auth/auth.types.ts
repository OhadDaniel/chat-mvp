import type { User } from '../../types'

export type LoginRequest = {
  name: string
  password: string
}

export type LoginResponse = {
  token: string
  user: User
}
