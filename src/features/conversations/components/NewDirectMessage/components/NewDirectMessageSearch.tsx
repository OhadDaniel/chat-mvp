import { TextInput } from '@/shared/components/TextInput'
import { useNewDirectMessageContext } from '../NewDirectMessage.context'
import {
  NEW_DM_SEARCH_PLACEHOLDER,
  NEW_DM_SEARCH_WRAP_CLASS,
  NEW_DM_SEARCH_INPUT_CLASS,
} from '../NewDirectMessage.constants'

export function NewDirectMessageSearch() {
  const { search, setSearch, busy } = useNewDirectMessageContext()

  return (
    <div className={NEW_DM_SEARCH_WRAP_CLASS}>
      <TextInput
        type="text"
        placeholder={NEW_DM_SEARCH_PLACEHOLDER}
        value={search}
        onChange={setSearch}
        disabled={busy}
        className={NEW_DM_SEARCH_INPUT_CLASS}
      />
    </div>
  )
}
