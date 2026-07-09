import { USERS } from '../../store'
import type { User } from '../../types'

export function findUserById(id: string): User | undefined {
  return USERS.find(u => u.id === id)
}

export function findUserByName(name: string): User | undefined {
  return USERS.find(u => u.name.toLowerCase() === name.toLowerCase())
}
