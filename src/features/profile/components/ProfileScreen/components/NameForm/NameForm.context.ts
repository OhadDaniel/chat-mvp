import { createContext, useContext } from 'react'
import type { NameFormContextValue } from './NameForm.types'

export const NameFormContext = createContext<NameFormContextValue | null>(null)

export function useNameFormContext(): NameFormContextValue {
  const ctx = useContext(NameFormContext)
  if (!ctx) throw new Error('useNameFormContext must be used inside <NameFormContainer>')
  return ctx
}
