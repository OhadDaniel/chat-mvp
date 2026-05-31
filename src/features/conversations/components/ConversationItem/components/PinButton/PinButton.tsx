import type { MouseEvent }                                             from 'react'
import { useConversationItemContext }                                    from '../../ConversationItem.context'
import { getPinButtonClass, getPinButtonLabel, getPinButtonAriaLabel } from './pinButton.utils'

export function PinButton() {
  const { isPinned, onTogglePin } = useConversationItemContext()

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    onTogglePin()
  }

  return (
    <button
      onClick={handleClick}
      className={getPinButtonClass(isPinned)}
      aria-label={getPinButtonAriaLabel(isPinned)}
    >
      {getPinButtonLabel(isPinned)}
    </button>
  )
}
