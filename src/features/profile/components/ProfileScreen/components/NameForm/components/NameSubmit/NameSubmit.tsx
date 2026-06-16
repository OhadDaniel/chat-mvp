import { useProfileContext } from '@/features/profile/components/ProfileScreen/ProfileScreen.context'
import { SubmitButton } from '@/shared/components/SubmitButton'
import {
  PROFILE_NAME_SUBMIT_LABEL,
  PROFILE_NAME_LOADING_LABEL,
  PROFILE_BUTTON_CLASS,
} from '@/features/profile/components/ProfileScreen/ProfileScreen.constants'

export function NameSubmit() {
  const { nameSaving } = useProfileContext()

  return (
    <SubmitButton
      label={PROFILE_NAME_SUBMIT_LABEL}
      loadingLabel={PROFILE_NAME_LOADING_LABEL}
      isLoading={nameSaving}
      className={PROFILE_BUTTON_CLASS}
    />
  )
}
