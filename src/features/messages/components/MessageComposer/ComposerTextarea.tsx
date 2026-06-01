import type { ChangeEvent, KeyboardEvent } from 'react'
import { COMPOSER_PLACEHOLDER, COMPOSER_ROWS } from './MessageComposer.constants'

type Props = {
  value:      string
  className:  string
  isDisabled: boolean
  onChange:   (e: ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown:  (e: KeyboardEvent<HTMLTextAreaElement>) => void
}

export function ComposerTextarea({ value, className, isDisabled, onChange, onKeyDown }: Props) {
  return (
    <textarea
      className={className}
      value={value}
      rows={COMPOSER_ROWS}
      placeholder={COMPOSER_PLACEHOLDER}
      disabled={isDisabled}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  )
}
