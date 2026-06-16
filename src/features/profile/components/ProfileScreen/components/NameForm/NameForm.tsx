import { useProfileContext } from '../../ProfileScreen.context'
import { ProfileSection } from '../shared/ProfileSection/ProfileSection'
import { ProfileForm }    from '../shared/ProfileForm/ProfileForm'
import { FirstNameInput } from './components/FirstNameInput/FirstNameInput'
import { LastNameInput }  from './components/LastNameInput/LastNameInput'
import { NameError }      from './components/NameError/NameError'
import { NameSubmit }     from './components/NameSubmit/NameSubmit'
import { PROFILE_NAME_SECTION_TITLE } from '../../ProfileScreen.constants'

export function NameForm() {
  const { onSubmitName } = useProfileContext()

  return (
    <ProfileSection title={PROFILE_NAME_SECTION_TITLE}>
      <ProfileForm onSubmit={onSubmitName}>
        <FirstNameInput />
        <LastNameInput />
        <NameError />
        <NameSubmit />
      </ProfileForm>
    </ProfileSection>
  )
}
