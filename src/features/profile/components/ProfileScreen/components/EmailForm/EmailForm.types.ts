import type { FormEvent } from 'react'

export type EmailFormContextValue = {
  email:    string
  error:    string | null
  saving:   boolean
  setEmail: (value: string) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}
