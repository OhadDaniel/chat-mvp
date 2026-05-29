import type { ConversationsStatus } from '@/features/conversations/types/index'
import type { ViewState }            from '../ConversationList.types'
import { VIEW_STATE }                from '../ConversationList.constants'

export function getViewState(status: ConversationsStatus, count: number): ViewState {
  if (status === VIEW_STATE.ERROR)   return VIEW_STATE.ERROR
  if (status === VIEW_STATE.LOADING) return VIEW_STATE.LOADING
  if (count === 0)                   return VIEW_STATE.EMPTY
  return VIEW_STATE.READY
}
