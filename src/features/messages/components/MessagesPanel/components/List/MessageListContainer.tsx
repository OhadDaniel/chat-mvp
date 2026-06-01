import { useAuth }             from '@/features/auth/context/AuthContext'
import { MessageListProvider } from './context/messageList.context'
import { MessageListContent }  from './MessageListContent'

export function MessageListContainer() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <MessageListProvider value={{ currentUser: user }}>
      <MessageListContent />
    </MessageListProvider>
  )
}
