import type { ReactNode } from 'react'

type Props = { children: ReactNode }

export function ConversationSkeleton({ children }: Props) {
  return <div>{children}</div>
}
