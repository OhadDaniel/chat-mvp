import { ConversationsProvider } from '@/features/conversations/context/conversations.context'
import { useAppLayout }         from './hooks/useAppLayout'
import { AppLayoutInner }       from './AppLayoutInner'

export function AppLayoutContainer() {
  const contextValue = useAppLayout()

  return (
    <ConversationsProvider value={contextValue}>
      <AppLayoutInner />
    </ConversationsProvider>
  )
}
