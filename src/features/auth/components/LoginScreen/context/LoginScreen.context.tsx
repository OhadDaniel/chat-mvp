import { createContext, useContext } from 'react'
import type { ReactNode }           from 'react'
import type { LoginContextValue }   from '../types/LoginScreen.types'

const LoginContext = createContext<LoginContextValue | null>(null)

export function useLoginContext(): LoginContextValue {
  const ctx = useContext(LoginContext)
  if (!ctx) throw new Error('useLoginContext must be used inside <LoginProvider>')
  return ctx
}

type Props = {
  value:    LoginContextValue
  children: ReactNode
}

export function LoginProvider({ value, children }: Props) {
  return (
    <LoginContext.Provider value={value}>
      {children}
    </LoginContext.Provider>
  )
}
