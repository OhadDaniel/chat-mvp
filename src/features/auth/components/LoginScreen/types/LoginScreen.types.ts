import type { ChangeEvent, FormEvent } from 'react'

export type LoginContextValue = {
  name:             string
  password:         string
  error:            string | null
  isLoading:        boolean
  onNameChange:     (e: ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleSubmit:     (e: FormEvent<HTMLFormElement>) => void
}
