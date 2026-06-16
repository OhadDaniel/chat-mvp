import { useProfileContext } from '@/features/profile/components/ProfileScreen/ProfileScreen.context'
import { TextInput } from '@/shared/components/TextInput'
import {
  PROFILE_EMAIL_PLACEHOLDER,
  PROFILE_INPUT_CLASS,
} from '@/features/profile/components/ProfileScreen/ProfileScreen.constants'

export function EmailInput() {
  const { email, emailSaving, setEmail } = useProfileContext()

  return (
    <TextInput
      type="email"
      placeholder={PROFILE_EMAIL_PLACEHOLDER}
      value={email}
      onChange={setEmail}
      disabled={emailSaving}
      className={PROFILE_INPUT_CLASS}
    />
  )
}
