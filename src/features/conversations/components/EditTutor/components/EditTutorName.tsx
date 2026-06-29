import { TextInput } from '@/shared/components/TextInput'
import { SubmitButton } from '@/shared/components/SubmitButton'
import type { EditTutorNameProps } from '../EditTutor.types'
import {
  EDIT_TUTOR_NAME_LABEL,
  EDIT_TUTOR_NAME_PLACEHOLDER,
  EDIT_TUTOR_NAME_SAVE_LABEL,
  EDIT_TUTOR_NAME_SAVING_LABEL,
  EDIT_TUTOR_SECTION_CLASS,
  EDIT_TUTOR_SECTION_LABEL_CLASS,
  EDIT_TUTOR_NAME_FORM_CLASS,
  EDIT_TUTOR_INPUT_CLASS,
  EDIT_TUTOR_PRIMARY_BUTTON_CLASS,
} from '../EditTutor.constants'

export function EditTutorName({ name, setName, savingName, onSubmitName }: EditTutorNameProps) {
  return (
    <section className={EDIT_TUTOR_SECTION_CLASS}>
      <h3 className={EDIT_TUTOR_SECTION_LABEL_CLASS}>{EDIT_TUTOR_NAME_LABEL}</h3>
      <form onSubmit={onSubmitName} className={EDIT_TUTOR_NAME_FORM_CLASS}>
        <TextInput
          type="text"
          placeholder={EDIT_TUTOR_NAME_PLACEHOLDER}
          value={name}
          onChange={setName}
          disabled={savingName}
          className={EDIT_TUTOR_INPUT_CLASS}
        />
        <SubmitButton
          label={EDIT_TUTOR_NAME_SAVE_LABEL}
          loadingLabel={EDIT_TUTOR_NAME_SAVING_LABEL}
          isLoading={savingName}
          className={EDIT_TUTOR_PRIMARY_BUTTON_CLASS}
        />
      </form>
    </section>
  )
}
