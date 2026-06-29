import { useAuth }                 from '@/features/auth/hooks/useAuth'
import { useConversationsContext } from '@/features/conversations/context/conversations.context'
import { getConversationDisplay }  from '@/features/conversations/utils/conversations.utils'
import { ASSISTANT_SENDER }        from '@/features/messages/constants'
import type { AiSender, Message }  from '@/features/messages/types'
import { useMessageList }          from './hooks/useMessageList'
import { MessageList }             from './MessageList'

type Props = {
  messages: Message[]
}

export function MessageListContainer({ messages }: Props) {
  const { user }                                  = useAuth()
  const { conversations, selectedConversationId } = useConversationsContext()
  const { sentinelRef }                           = useMessageList(messages)

  const conversation =
    conversations.find(c => c.id === selectedConversationId) ?? null
  const display =
    conversation && user ? getConversationDisplay(conversation, user.id) : null

  const aiSender: AiSender =
    conversation?.type === 'tutor' && display
      ? { name: display.title, initials: display.initials, avatarUrl: display.avatarUrl }
      : {
          name:      ASSISTANT_SENDER.name,
          initials:  ASSISTANT_SENDER.avatarInitials,
          avatarUrl: ASSISTANT_SENDER.avatarUrl,
        }

  return (
    <MessageList
      messages={messages}
      currentUserId={user?.id ?? ''}
      sentinelRef={sentinelRef}
      aiSender={aiSender}
    />
  )
}
