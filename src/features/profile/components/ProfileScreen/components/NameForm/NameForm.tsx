import { useNameFormContext } from './NameForm.context'
import { ProfileSection } from '../shared/ProfileSection/ProfileSection'
import { ProfileForm }    from '../shared/ProfileForm/ProfileForm'
import { TextInput }    from '@/shared/components/TextInput'
import { FormError }    from '@/shared/components/FormError'
import { SubmitButton } from '@/shared/components/SubmitButton'
import {
  PROFILE_NAME_SECTION_TITLE,
  PROFILE_FIRST_NAME_PLACEHOLDER,
  PROFILE_LAST_NAME_PLACEHOLDER,
  PROFILE_INPUT_CLASS,
  PROFILE_ERROR_CLASS,
  PROFILE_BUTTON_CLASS,
  PROFILE_NAME_SUBMIT_LABEL,
  PROFILE_NAME_LOADING_LABEL,
} from '../../ProfileScreen.constants'

export function NameForm() {
  const { firstName, lastName, error, saving, setFirstName, setLastName, onSubmit } =
    useNameFormContext()

  return (
    <ProfileSection title={PROFILE_NAME_SECTION_TITLE}>
      <ProfileForm onSubmit={onSubmit}>
        <TextInput
          type="text"
          placeholder={PROFILE_FIRST_NAME_PLACEHOLDER}
          value={firstName}
          onChange={setFirstName}
          disabled={saving}
          className={PROFILE_INPUT_CLASS}
        />
        <TextInput
          type="text"
          placeholder={PROFILE_LAST_NAME_PLACEHOLDER}
          value={lastName}
          onChange={setLastName}
          disabled={saving}
          className={PROFILE_INPUT_CLASS}
        />
        <FormError error={error} className={PROFILE_ERROR_CLASS} />
        <SubmitButton
          label={PROFILE_NAME_SUBMIT_LABEL}
          loadingLabel={PROFILE_NAME_LOADING_LABEL}
          isLoading={saving}
          className={PROFILE_BUTTON_CLASS}
        />
      </ProfileForm>
    </ProfileSection>
  )
}
