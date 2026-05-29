import { getPinButtonClass, getPinButtonLabel, getPinButtonAriaLabel } from './pinButton.utils'

type Props = {
  isPinned:    boolean
  onTogglePin: () => void
}

export function PinButton({ isPinned, onTogglePin }: Props) {
  return (
    <button
      onClick={onTogglePin}
      className={getPinButtonClass(isPinned)}
      aria-label={getPinButtonAriaLabel(isPinned)}
    >
      {getPinButtonLabel(isPinned)}
    </button>
  )
}
