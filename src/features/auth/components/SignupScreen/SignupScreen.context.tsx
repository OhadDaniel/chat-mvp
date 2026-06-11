import { createContext, useContext } from 'react'
import type { SignupContextValue } from './SignupScreen.types'

export const SignupContext = createContext<SignupContextValue | null>(null)

export function useSignupContext(): SignupContextValue {
  const ctx = useContext(SignupContext)
  if (!ctx) throw new Error('useSignupContext must be used inside <SignupScreen>')
  return ctx
}
