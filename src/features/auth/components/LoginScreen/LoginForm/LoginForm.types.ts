import type { ChangeEvent, FormEvent } from 'react'

export type LoginFormProps = {
  name:             string
  password:         string
  error:            string | null
  isLoading:        boolean
  onNameChange:     (e: ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmit:         (e: FormEvent<HTMLFormElement>) => void
}
