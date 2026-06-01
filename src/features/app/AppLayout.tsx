import type { ReactNode } from 'react'
import { APP_LAYOUT_CLASS } from './AppLayout.constants'

type Props = {
  children: ReactNode
}

export function AppLayout({ children }: Props) {
  return (
    <div className={APP_LAYOUT_CLASS}>
      {children}
    </div>
  )
}
