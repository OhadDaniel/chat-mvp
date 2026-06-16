import { useProfileContext } from '@/features/profile/components/ProfileScreen/ProfileScreen.context'
import { SubmitButton } from '@/shared/components/SubmitButton'
import {
  PROFILE_EMAIL_SUBMIT_LABEL,
  PROFILE_EMAIL_LOADING_LABEL,
  PROFILE_BUTTON_CLASS,
} from '@/features/profile/components/ProfileScreen/ProfileScreen.constants'

export function EmailSubmit() {
  const { emailSaving } = useProfileContext()

  return (
    <SubmitButton
      label={PROFILE_EMAIL_SUBMIT_LABEL}
      loadingLabel={PROFILE_EMAIL_LOADING_LABEL}
      isLoading={emailSaving}
      className={PROFILE_BUTTON_CLASS}
    />
  )
}
