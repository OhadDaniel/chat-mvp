import { useEffect }                   from 'react'
import { useAuth }                     from '@/features/auth/hooks/useAuth'
import { conversationsApi }            from '@/features/conversations/api/conversations.api'
import { CONVERSATIONS_STATUS }        from '../constants'
import { sortConversations }           from '../utils/conversations.utils'
import { useConversationsState }       from './useConversationsState'
import { useDebounced }                from '@/shared/hooks/useDebounced'
import type { UseConversationsReturn } from '../types'

const SEARCH_DEBOUNCE_MS = 300

export function useConversations(): UseConversationsReturn {
  const { user }                                                                           = useAuth()
  const { state, setConversations, addConversation, setStatus, setSearch, applyTogglePin } = useConversationsState()

  const fetchConversations = async (search?: string) => {
    setStatus(CONVERSATIONS_STATUS.LOADING)
    try {
      const { conversations } = await conversationsApi.getAll(search || undefined)
      setConversations(conversations)
      setStatus(CONVERSATIONS_STATUS.IDLE)
    } catch {
      setStatus(CONVERSATIONS_STATUS.ERROR)
    }
  }

  const debouncedFetch = useDebounced(fetchConversations, SEARCH_DEBOUNCE_MS)

  // Initial load once the user is known. Search-driven refetches go through
  // handleSearch below, so this effect only depends on `user`.
  useEffect(() => {
    if (user) fetchConversations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleSearch = (search: string) => {
    setSearch(search)        // keep the controlled input in sync immediately
    debouncedFetch(search)   // gate the network call directly
  }

  const togglePin = async (id: string, currentlyPinned: boolean) => {
    const { conversation } = await conversationsApi.patch(id, { pinned: !currentlyPinned })
    applyTogglePin(id, conversation.pinnedAt)
  }

  return {
    conversations: sortConversations(state.conversations),
    status:        state.status,
    search:        state.search,
    setSearch:     handleSearch,
    togglePin,
    addConversation,
  }
}
