import { request } from '@/api/client'
import type { ListUsersResponse } from './user.types'

export const userApi = {
  list: (): Promise<ListUsersResponse> => request('/users'),
}
