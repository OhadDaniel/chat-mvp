import type { FormEvent } from 'react'

export type SignupContextValue = {
  name:         string
  email:        string
  password:     string
  error:        string | null
  isLoading:    boolean
  setName:      (value: string) => void
  setEmail:     (value: string) => void
  setPassword:  (value: string) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
}
