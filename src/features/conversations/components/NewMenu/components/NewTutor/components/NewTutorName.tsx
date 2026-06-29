import { TextInput } from '@/shared/components/TextInput'
import { useNewTutorContext } from '../NewTutor.context'
import {
  NEW_TUTOR_NAME_PLACEHOLDER,
  NEW_TUTOR_INPUT_CLASS,
} from '../NewTutor.constants'

export function NewTutorName() {
  const { name, setName, busy } = useNewTutorContext()

  return (
    <TextInput
      type="text"
      placeholder={NEW_TUTOR_NAME_PLACEHOLDER}
      value={name}
      onChange={setName}
      disabled={busy}
      className={NEW_TUTOR_INPUT_CLASS}
    />
  )
}
