import { useEffect, useState } from 'react'
import { userApi } from '@/features/user/api/user.api'
import type { UserProfile } from '@/features/user/types'

export function useUserDirectory() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    let active = true
    void userApi.list().then(({ users }) => {
      if (active) setUsers(users)
    })
    return () => {
      active = false
    }
  }, [])

  const term = search.trim().toLowerCase()
  const matches = term
    ? users.filter(u => u.name.toLowerCase().includes(term))
    : users

  return { users: matches, search, setSearch }
}
