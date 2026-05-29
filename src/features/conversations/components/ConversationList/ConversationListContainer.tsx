import { useConversationList } from './hooks/useConversationList'
import { ConversationList }    from './ConversationList'

export function ConversationListContainer() {
  const { viewState, items } = useConversationList()
  return <ConversationList viewState={viewState} items={items} />
}
