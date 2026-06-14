import type { FormEvent } from 'react'

export type LoginContextValue = {
  email:        string
  password:     string
  error:        string | null
  isLoading:    boolean
  setEmail:     (value: string) => void
  setPassword:  (value: string) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
}
