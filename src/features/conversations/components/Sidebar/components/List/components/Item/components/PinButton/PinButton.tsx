import { useConversationItemContext } from '../../context/ConversationItem.context'

export function PinButton() {
  const { pinButtonClass, pinButtonLabel, pinButtonAriaLabel, onPinClick } = useConversationItemContext()

  return (
    <button
      onClick={onPinClick}
      className={pinButtonClass}
      aria-label={pinButtonAriaLabel}
    >
      {pinButtonLabel}
    </button>
  )
}
