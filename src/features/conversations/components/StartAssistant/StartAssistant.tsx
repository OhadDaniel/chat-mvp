import type { StartAssistantProps } from './StartAssistant.types'
import {
  START_ASSISTANT_LABEL,
  START_ASSISTANT_GLYPH,
  START_ASSISTANT_TRIGGER_CLASS,
} from './StartAssistant.constants'

export function StartAssistant({ onClick, disabled }: StartAssistantProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={START_ASSISTANT_LABEL}
      className={START_ASSISTANT_TRIGGER_CLASS}
    >
      {START_ASSISTANT_GLYPH}
    </button>
  )
}
