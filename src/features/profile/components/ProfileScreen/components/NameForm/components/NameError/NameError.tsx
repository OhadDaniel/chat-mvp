import { useProfileContext } from '@/features/profile/components/ProfileScreen/ProfileScreen.context'
import { FormError } from '@/shared/components/FormError'
import { PROFILE_ERROR_CLASS } from '@/features/profile/components/ProfileScreen/ProfileScreen.constants'

export function NameError() {
  const { nameError } = useProfileContext()

  return <FormError error={nameError} className={PROFILE_ERROR_CLASS} />
}
