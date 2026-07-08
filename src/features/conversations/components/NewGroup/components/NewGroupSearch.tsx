import { TextInput } from '@/shared/components/TextInput'
import { useNewGroupContext } from '../NewGroup.context'
import {
  NEW_GROUP_SEARCH_PLACEHOLDER,
  NEW_GROUP_INPUT_CLASS,
} from '../NewGroup.constants'

export function NewGroupSearch() {
  const { search, setSearch, busy } = useNewGroupContext()

  return (
    <TextInput
      type="text"
      placeholder={NEW_GROUP_SEARCH_PLACEHOLDER}
      value={search}
      onChange={setSearch}
      disabled={busy}
      className={NEW_GROUP_INPUT_CLASS}
    />
  )
}
