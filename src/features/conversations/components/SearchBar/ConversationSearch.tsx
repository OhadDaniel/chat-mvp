import type { ConversationSearchProps }                              from './ConversationSearch.types'
import { SEARCH_PLACEHOLDER, SEARCH_WRAPPER_CLASS, SEARCH_INPUT_CLASS } from './ConversationSearch.constants'

export function ConversationSearch({ value, onChange }: ConversationSearchProps) {
  return (
    <div className={SEARCH_WRAPPER_CLASS}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={SEARCH_PLACEHOLDER}
        className={SEARCH_INPUT_CLASS}
      />
    </div>
  )
}
