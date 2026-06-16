import { createContext, useContext } from 'react'
import type { ProfileContextValue } from './ProfileScreen.types'

export const ProfileContext = createContext<ProfileContextValue | null>(null)

export function useProfileContext(): ProfileContextValue {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfileContext must be used inside <ProfileScreen>')
  return ctx
}
