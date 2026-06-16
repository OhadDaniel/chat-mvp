import { useProfileContext } from '@/features/profile/components/ProfileScreen/ProfileScreen.context'
import { FormError } from '@/shared/components/FormError'
import { PROFILE_ERROR_CLASS } from '@/features/profile/components/ProfileScreen/ProfileScreen.constants'

export function EmailError() {
  const { emailError } = useProfileContext()

  return <FormError error={emailError} className={PROFILE_ERROR_CLASS} />
}
