import type { ChangeEvent } from 'react'

export type ConversationSearchProps = {
  value:    string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}
