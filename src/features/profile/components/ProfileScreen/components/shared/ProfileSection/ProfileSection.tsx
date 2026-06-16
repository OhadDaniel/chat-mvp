import type { ReactNode } from 'react'
import { PROFILE_SECTION_CLASS, PROFILE_SECTION_TITLE_CLASS } from './ProfileSection.constants'

type Props = {
  title:    string
  children: ReactNode
}

export function ProfileSection({ title, children }: Props) {
  return (
    <section className={PROFILE_SECTION_CLASS}>
      <h2 className={PROFILE_SECTION_TITLE_CLASS}>{title}</h2>
      {children}
    </section>
  )
}
