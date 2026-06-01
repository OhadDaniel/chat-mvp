import {
  COMPOSER_WRAPPER_CLASS,
  COMPOSER_TEXTAREA_CLASS,
  COMPOSER_BUTTON_CLASS,
} from './MessageComposer.constants'
import type { MessageComposerContainerProps } from './MessageComposer.types'
import { useMessageComposer }                 from './hooks/useMessageComposer'
import { MessageComposer }                    from './MessageComposer'

const classNames = {
  wrapper:  COMPOSER_WRAPPER_CLASS,
  textarea: COMPOSER_TEXTAREA_CLASS,
  button:   COMPOSER_BUTTON_CLASS,
}

export function MessageComposerContainer({ sendMessage, isDisabled }: MessageComposerContainerProps) {
  const { value, onChange, onKeyDown, onSend } = useMessageComposer(sendMessage)

  return (
    <MessageComposer
      value={value}
      isDisabled={isDisabled}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onSend={onSend}
      classNames={classNames}
    />
  )
}
