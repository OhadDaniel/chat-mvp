import { MESSAGES_STATUS }         from '@/features/messages/constants'
import { useConversationsContext } from '@/features/conversations/context/conversations.context'
import { useMessagesContext }      from '@/features/messages/context/messages.context'

const DEFAULT_TITLE = 'Select a conversation'

export type MessagesPanelStatus = 'no-conversation' | 'loading' | 'error' | 'empty' | 'ready'

export function useMessagesPanel(): {
  title:             string
  conversationId:    string | null
  panelStatus:       MessagesPanelStatus
  retryLoadMessages: () => void
} {
  const { selectedConversationId: conversationId, selectedConversationName: conversationName } = useConversationsContext()
  const { messages, status, retryLoadMessages } = useMessagesContext()

  const title = conversationName ?? DEFAULT_TITLE

  let panelStatus: MessagesPanelStatus
  if (!conversationId)            panelStatus = 'no-conversation'
  else if (status === MESSAGES_STATUS.LOADING) panelStatus = 'loading'
  else if (status === MESSAGES_STATUS.ERROR)   panelStatus = 'error'
  else if (messages.length === 0)              panelStatus = 'empty'
  else                                         panelStatus = 'ready'

  return { title, conversationId, panelStatus, retryLoadMessages }
}
