import { BubbleContainer }  from './components/Bubble/BubbleContainer'
import { MessageList }      from './MessageList'
import { useMessageList }   from './hooks/useMessageList'

export function MessageListContent() {
  const { sentinelRef, messages } = useMessageList()

  return (
    <MessageList sentinelRef={sentinelRef}>
      {messages.map(message => (
        <BubbleContainer key={message.id} message={message} />
      ))}
    </MessageList>
  )
}
