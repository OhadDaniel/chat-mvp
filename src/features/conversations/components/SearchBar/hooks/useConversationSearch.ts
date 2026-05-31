import type { ChangeEvent }          from 'react'
import { useConversationsContext }    from '@/features/conversations/context/conversations.context'

type UseConversationSearchReturn = {
  search:       string
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function useConversationSearch(): UseConversationSearchReturn {
  const { search, setSearch } = useConversationsContext()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

  return { search, handleChange }
}
