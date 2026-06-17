import type { FormEvent } from 'react'

export type NameFormContextValue = {
  firstName:    string
  lastName:     string
  error:        string | null
  saving:       boolean
  setFirstName: (value: string) => void
  setLastName:  (value: string) => void
  onSubmit:     (e: FormEvent<HTMLFormElement>) => void
}
