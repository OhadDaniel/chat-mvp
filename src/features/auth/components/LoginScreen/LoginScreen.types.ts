import type { FormEvent } from 'react'

export type LoginContextValue = {
  name:         string
  password:     string
  error:        string | null
  isLoading:    boolean
  setName:      (value: string) => void
  setPassword:  (value: string) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
}
