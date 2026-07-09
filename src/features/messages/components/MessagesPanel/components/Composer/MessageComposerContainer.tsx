import {
  COMPOSER_WRAPPER_CLASS,
  COMPOSER_TEXTAREA_CLASS,
  COMPOSER_BUTTON_CLASS,
} from './constants/MessageComposer.constants'
import { useMessagesContext }  from '@/features/messages/context/messages.context'
import { MESSAGES_STATUS }    from '@/features/messages/constants'
import { useMessageComposer } from './hooks/useMessageComposer'
import { ComposerProvider }   from './context/composer.context'
import { MessageComposer }    from './MessageComposer'

const classNames = {
  wrapper:  COMPOSER_WRAPPER_CLASS,
  textarea: COMPOSER_TEXTAREA_CLASS,
  button:   COMPOSER_BUTTON_CLASS,
}

export function MessageComposerContainer() {
  const { sendMessage, status }                = useMessagesContext()
  const { value, onChange, onKeyDown, onSend } = useMessageComposer(sendMessage)

  const isDisabled = status === MESSAGES_STATUS.LOADING || status === MESSAGES_STATUS.ERROR

  return (
    <ComposerProvider value={{ value, isDisabled, onChange, onKeyDown, onSend, classNames }}>
      <MessageComposer />
    </ComposerProvider>
  )
}
