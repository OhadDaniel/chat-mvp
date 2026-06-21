import { createContext, useContext } from 'react'
import type { EmailFormContextValue } from './EmailForm.types'

export const EmailFormContext = createContext<EmailFormContextValue | null>(null)

export function useEmailFormContext(): EmailFormContextValue {
  const ctx = useContext(EmailFormContext)
  if (!ctx) throw new Error('useEmailFormContext must be used inside <EmailFormContainer>')
  return ctx
}
