import { EMPTY_STATE_MESSAGE, EMPTY_STATE_CLASS } from './ConversationEmptyState.constants'

export function ConversationEmptyState() {
  return (
    <div className={EMPTY_STATE_CLASS}>
      {EMPTY_STATE_MESSAGE}
    </div>
  )
}
