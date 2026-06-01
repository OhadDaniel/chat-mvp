import {
  MESSAGES_LOAD_ERROR_MESSAGE,
  MESSAGES_LOAD_ERROR_CLASS,
  MESSAGES_RETRY_LABEL,
  MESSAGES_RETRY_CLASS,
} from './MessagesLoadError.constants'

type Props = {
  onRetry:    () => void
  isRetrying: boolean
}

export function MessagesLoadError({ onRetry, isRetrying }: Props) {
  return (
    <div className={MESSAGES_LOAD_ERROR_CLASS}>
      <p>{MESSAGES_LOAD_ERROR_MESSAGE}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className={MESSAGES_RETRY_CLASS}
      >
        {MESSAGES_RETRY_LABEL}
      </button>
    </div>
  )
}
