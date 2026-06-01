import { ConversationSidebar }    from '@/features/conversations/components/Sidebar/ConversationSidebar'
import { MessagesPanelContainer } from '@/features/messages/components/MessagesPanel/MessagesPanelContainer'
import { AppLayout }              from './AppLayout'

export function AppLayoutInner() {
  return (
    <AppLayout>
      <ConversationSidebar />
      <MessagesPanelContainer />
    </AppLayout>
  )
}
