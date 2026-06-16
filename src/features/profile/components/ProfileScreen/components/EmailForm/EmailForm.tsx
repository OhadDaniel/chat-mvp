import { useProfileContext } from '../../ProfileScreen.context'
import { ProfileSection } from '../shared/ProfileSection/ProfileSection'
import { ProfileForm }    from '../shared/ProfileForm/ProfileForm'
import { EmailInput }     from './components/EmailInput/EmailInput'
import { EmailError }     from './components/EmailError/EmailError'
import { EmailSubmit }    from './components/EmailSubmit/EmailSubmit'
import { PROFILE_EMAIL_SECTION_TITLE } from '../../ProfileScreen.constants'

export function EmailForm() {
  const { onSubmitEmail } = useProfileContext()

  return (
    <ProfileSection title={PROFILE_EMAIL_SECTION_TITLE}>
      <ProfileForm onSubmit={onSubmitEmail}>
        <EmailInput />
        <EmailError />
        <EmailSubmit />
      </ProfileForm>
    </ProfileSection>
  )
}
