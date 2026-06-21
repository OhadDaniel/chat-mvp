import { useNewDirectMessageContext } from '../NewDirectMessage.context'
import {
  NEW_DM_OPEN_LABEL,
  NEW_DM_TRIGGER_GLYPH,
  NEW_DM_TRIGGER_CLASS,
} from '../NewDirectMessage.constants'

export function NewDirectMessageTrigger() {
  const { open } = useNewDirectMessageContext()

  return (
    <button
      type="button"
      onClick={open}
      aria-label={NEW_DM_OPEN_LABEL}
      className={NEW_DM_TRIGGER_CLASS}
    >
      {NEW_DM_TRIGGER_GLYPH}
    </button>
  )
}
