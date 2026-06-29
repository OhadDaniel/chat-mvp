import { TextInput } from '@/shared/components/TextInput'
import { useNewGroupContext } from '../NewGroup.context'
import {
  NEW_GROUP_NAME_PLACEHOLDER,
  NEW_GROUP_INPUT_CLASS,
} from '../NewGroup.constants'

export function NewGroupName() {
  const { name, setName, busy } = useNewGroupContext()

  return (
    <TextInput
      type="text"
      placeholder={NEW_GROUP_NAME_PLACEHOLDER}
      value={name}
      onChange={setName}
      disabled={busy}
      className={NEW_GROUP_INPUT_CLASS}
    />
  )
}
