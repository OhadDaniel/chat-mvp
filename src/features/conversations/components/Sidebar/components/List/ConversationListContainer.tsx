import {
  VIEW_STATE,
  CONVERSATION_LIST_ERROR,
  CONVERSATION_LIST_ERROR_CLASS,
}                                        from './constants/ConversationList.constants'
import { useConversationList }           from './hooks/useConversationList'
import { ConversationEmptyState }        from '../../../EmptyState/ConversationEmptyState'
import { ConversationSkeletonContainer } from '../../../Skeleton/ConversationSkeletonContainer'
import { ConversationList }              from './ConversationList'
import { ConversationItemContainer }     from './components/Item/ConversationItemContainer'

export function ConversationListContainer() {
  const { viewState, conversations } = useConversationList()

  if (viewState === VIEW_STATE.LOADING) return <ConversationSkeletonContainer />
  if (viewState === VIEW_STATE.EMPTY)   return <ConversationEmptyState />
  if (viewState === VIEW_STATE.ERROR)   return (
    <div className={CONVERSATION_LIST_ERROR_CLASS}>
      {CONVERSATION_LIST_ERROR}
    </div>
  )

  return (
    <ConversationList>
      {conversations.map(conversation => (
        <ConversationItemContainer key={conversation.id} conversation={conversation} />
      ))}
    </ConversationList>
  )
}
