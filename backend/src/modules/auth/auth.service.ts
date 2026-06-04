import { findUserById, findUserByName } from './auth.repository'
import type { User } from '../../types'

export function findById(id: string): User | undefined {
  return findUserById(id)
}

export function findByName(name: string): User | undefined {
  return findUserByName(name)
}
