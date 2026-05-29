import { ConversationSearch }      from './ConversationSearch'
import { useConversationSearch }   from './hooks/useConversationSearch'

export function ConversationSearchContainer() {
  const { search, handleChange } = useConversationSearch()

  return (
    <ConversationSearch value={search} onChange={handleChange} />
  )
}
