import { COMPOSER_BUTTON_LABEL } from './MessageComposer.constants'

type Props = {
  className:  string
  isDisabled: boolean
  value:      string
  onSend:     () => void
}

export function ComposerButton({ className, isDisabled, value, onSend }: Props) {
  return (
    <button
      className={className}
      disabled={isDisabled || value.trim().length === 0}
      onClick={onSend}
    >
      {COMPOSER_BUTTON_LABEL}
    </button>
  )
}
