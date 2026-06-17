import { createContext, useContext } from 'react'
import type { AvatarContextValue } from './AvatarSection.types'

export const AvatarContext = createContext<AvatarContextValue | null>(null)

export function useAvatarContext(): AvatarContextValue {
  const ctx = useContext(AvatarContext)
  if (!ctx) throw new Error('useAvatarContext must be used inside <AvatarSectionContainer>')
  return ctx
}
