import { useAuth }        from '@/features/auth/hooks/useAuth'
import type { Message }   from '@/features/messages/types'
import { useMessageList } from './hooks/useMessageList'
import { MessageList }    from './MessageList'

type Props = {
  messages: Message[]
}

export function MessageListContainer({ messages }: Props) {
  const { user }        = useAuth()
  const { sentinelRef } = useMessageList(messages)

  return (
    <MessageList
      messages={messages}
      currentUserId={user?.id ?? ''}
      sentinelRef={sentinelRef}
    />
  )
}
