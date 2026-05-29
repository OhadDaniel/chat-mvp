import { useEffect, useCallback }      from 'react'
import { useAuth }                     from '@/features/auth/hooks/useAuth'
import { conversationsApi }            from '@/api/apiClient'
import { CONVERSATIONS_STATUS }        from '../constants'
import { sortConversations }           from '../utils/conversations.utils'
import { useConversationsState }       from './useConversationsState'
import type { UseConversationsReturn } from '../types'

export function useConversations(): UseConversationsReturn {
  const { user }                                               = useAuth()
  const { state, setConversations, setStatus, setSearch, applyTogglePin } = useConversationsState()

  const fetchConversations = useCallback(async (search: string) => {
    setStatus(CONVERSATIONS_STATUS.LOADING)
    try {
      const { conversations } = await conversationsApi.getAll(search || undefined)
      setConversations(conversations)
      setStatus(CONVERSATIONS_STATUS.IDLE)
    } catch {
      setStatus(CONVERSATIONS_STATUS.ERROR)
    }
  }, [])

  useEffect(() => {
    if (user) fetchConversations(state.search)
  }, [user, state.search, fetchConversations])

  const togglePin = useCallback(async (id: string, currentlyPinned: boolean) => {
    const { conversation } = await conversationsApi.patch(id, { pinned: !currentlyPinned })
    applyTogglePin(id, conversation.pinnedAt)
  }, [])

  return {
    conversations: sortConversations(state.conversations),
    status:        state.status,
    search:        state.search,
    setSearch,
    togglePin,
  }
}
