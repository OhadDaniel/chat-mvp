import { useEmailFormContext } from './EmailForm.context'
import { ProfileSection } from '../shared/ProfileSection/ProfileSection'
import { ProfileForm }    from '../shared/ProfileForm/ProfileForm'
import { TextInput }    from '@/shared/components/TextInput'
import { FormError }    from '@/shared/components/FormError'
import { SubmitButton } from '@/shared/components/SubmitButton'
import {
  PROFILE_EMAIL_SECTION_TITLE,
  PROFILE_EMAIL_PLACEHOLDER,
  PROFILE_INPUT_CLASS,
  PROFILE_ERROR_CLASS,
  PROFILE_BUTTON_CLASS,
  PROFILE_EMAIL_SUBMIT_LABEL,
  PROFILE_EMAIL_LOADING_LABEL,
} from '../../ProfileScreen.constants'

export function EmailForm() {
  const { email, error, saving, setEmail, onSubmit } = useEmailFormContext()

  return (
    <ProfileSection title={PROFILE_EMAIL_SECTION_TITLE}>
      <ProfileForm onSubmit={onSubmit}>
        <TextInput
          type="email"
          placeholder={PROFILE_EMAIL_PLACEHOLDER}
          value={email}
          onChange={setEmail}
          disabled={saving}
          className={PROFILE_INPUT_CLASS}
        />
        <FormError error={error} className={PROFILE_ERROR_CLASS} />
        <SubmitButton
          label={PROFILE_EMAIL_SUBMIT_LABEL}
          loadingLabel={PROFILE_EMAIL_LOADING_LABEL}
          isLoading={saving}
          className={PROFILE_BUTTON_CLASS}
        />
      </ProfileForm>
    </ProfileSection>
  )
}
