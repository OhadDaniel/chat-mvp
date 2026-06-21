import type { FormEvent, ReactNode } from 'react'
import { PROFILE_FORM_CLASS } from './ProfileForm.constants'

type Props = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  children: ReactNode
}

export function ProfileForm({ onSubmit, children }: Props) {
  return (
    <form onSubmit={onSubmit} className={PROFILE_FORM_CLASS}>
      {children}
    </form>
  )
}
