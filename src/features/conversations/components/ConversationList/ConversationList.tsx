import type { ViewState }             from './ConversationList.types'
import type { Conversation }          from '@/features/conversations/types/index'
import type { User }                  from '@/features/user/types'
import {
  VIEW_STATE,
  CONVERSATION_LIST_CLASS,
  CONVERSATION_LIST_ERROR,
  CONVERSATION_LIST_ERROR_CLASS,
}                                     from './ConversationList.constants'
import { ConversationEmptyState }        from '../EmptyState/ConversationEmptyState'
import { ConversationSkeletonContainer } from '../Skeleton/ConversationSkeletonContainer'
import { ConversationItemContainer }     from '../ConversationItem/ConversationItemContainer'

type TogglePin = (id: string, currentlyPinned: boolean) => Promise<void>

type Props = {
  viewState:              ViewState
  conversations:          Conversation[]
  currentUser:            User
  selectedConversationId: string | null
  togglePin:              TogglePin
  onSelectConversation:   (id: string) => void
}

export function ConversationList({ viewState, conversations, currentUser, selectedConversationId, togglePin, onSelectConversation }: Props) {
  if (viewState === VIEW_STATE.LOADING) return <ConversationSkeletonContainer />
  if (viewState === VIEW_STATE.EMPTY)   return <ConversationEmptyState />
  if (viewState === VIEW_STATE.ERROR)   return (
    <div className={CONVERSATION_LIST_ERROR_CLASS}>
      {CONVERSATION_LIST_ERROR}
    </div>
  )

  return (
    <ul className={CONVERSATION_LIST_CLASS}>
      {conversations.map(conversation => (
        <ConversationItemContainer
          key={conversation.id}
          conversation={conversation}
          currentUser={currentUser}
          selectedConversationId={selectedConversationId}
          togglePin={togglePin}
          onSelectConversation={onSelectConversation}
        />
      ))}
    </ul>
  )
}
