import type { ChangeEvent, KeyboardEvent } from 'react'

export type ComposerClassNames = {
  wrapper:  string
  textarea: string
  button:   string
}

export type MessageComposerProps = {
  value:      string
  isDisabled: boolean
  onChange:   (e: ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown:  (e: KeyboardEvent<HTMLTextAreaElement>) => void
  onSend:     () => void
  classNames: ComposerClassNames
}

export type MessageComposerContainerProps = {
  sendMessage: (content: string) => Promise<void>
  isDisabled:  boolean
}
