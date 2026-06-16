import { useProfileContext } from '@/features/profile/components/ProfileScreen/ProfileScreen.context'
import { TextInput } from '@/shared/components/TextInput'
import {
  PROFILE_FIRST_NAME_PLACEHOLDER,
  PROFILE_INPUT_CLASS,
} from '@/features/profile/components/ProfileScreen/ProfileScreen.constants'

export function FirstNameInput() {
  const { firstName, nameSaving, setFirstName } = useProfileContext()

  return (
    <TextInput
      type="text"
      placeholder={PROFILE_FIRST_NAME_PLACEHOLDER}
      value={firstName}
      onChange={setFirstName}
      disabled={nameSaving}
      className={PROFILE_INPUT_CLASS}
    />
  )
}
