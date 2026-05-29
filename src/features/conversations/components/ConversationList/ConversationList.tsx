import type { ReactNode }             from 'react'
import type { ViewState }             from './ConversationList.types'
import {
  VIEW_STATE,
  CONVERSATION_LIST_CLASS,
  CONVERSATION_LIST_ERROR,
  CONVERSATION_LIST_ERROR_CLASS,
}                                     from './ConversationList.constants'
import { ConversationEmptyState }     from '../EmptyState/ConversationEmptyState'
import { ConversationSkeletonContainer } from '../Skeleton/ConversationSkeletonContainer'

type Props = {
  viewState: ViewState
  items:     ReactNode[]
}

export function ConversationList({ viewState, items }: Props) {
  if (viewState === VIEW_STATE.LOADING) return <ConversationSkeletonContainer />
  if (viewState === VIEW_STATE.EMPTY)   return <ConversationEmptyState />
  if (viewState === VIEW_STATE.ERROR)   return (
    <div className={CONVERSATION_LIST_ERROR_CLASS}>
      {CONVERSATION_LIST_ERROR}
    </div>
  )

  return (
    <ul className={CONVERSATION_LIST_CLASS}>
      {items}
    </ul>
  )
}
