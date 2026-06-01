import type { ReactNode }          from 'react'
import { CONVERSATION_LIST_CLASS } from './constants/ConversationList.constants'

type Props = {
  children: ReactNode
}

export function ConversationList({ children }: Props) {
  return (
    <ul className={CONVERSATION_LIST_CLASS}>
      {children}
    </ul>
  )
}
