import { useProfileContext } from '@/features/profile/components/ProfileScreen/ProfileScreen.context'
import { TextInput } from '@/shared/components/TextInput'
import {
  PROFILE_LAST_NAME_PLACEHOLDER,
  PROFILE_INPUT_CLASS,
} from '@/features/profile/components/ProfileScreen/ProfileScreen.constants'

export function LastNameInput() {
  const { lastName, nameSaving, setLastName } = useProfileContext()

  return (
    <TextInput
      type="text"
      placeholder={PROFILE_LAST_NAME_PLACEHOLDER}
      value={lastName}
      onChange={setLastName}
      disabled={nameSaving}
      className={PROFILE_INPUT_CLASS}
    />
  )
}
