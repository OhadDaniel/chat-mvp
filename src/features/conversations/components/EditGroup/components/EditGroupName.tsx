import { TextInput } from '@/shared/components/TextInput'
import { SubmitButton } from '@/shared/components/SubmitButton'
import { useEditGroupContext } from '../EditGroup.context'
import {
  EDIT_GROUP_NAME_LABEL,
  EDIT_GROUP_NAME_PLACEHOLDER,
  EDIT_GROUP_NAME_SAVE_LABEL,
  EDIT_GROUP_NAME_SAVING_LABEL,
  EDIT_GROUP_SECTION_CLASS,
  EDIT_GROUP_SECTION_LABEL_CLASS,
  EDIT_GROUP_NAME_FORM_CLASS,
  EDIT_GROUP_INPUT_CLASS,
  EDIT_GROUP_PRIMARY_BUTTON_CLASS,
} from '../EditGroup.constants'

export function EditGroupName() {
  const { name, setName, savingName, onSubmitName } = useEditGroupContext()

  return (
    <section className={EDIT_GROUP_SECTION_CLASS}>
      <h3 className={EDIT_GROUP_SECTION_LABEL_CLASS}>{EDIT_GROUP_NAME_LABEL}</h3>
      <form onSubmit={onSubmitName} className={EDIT_GROUP_NAME_FORM_CLASS}>
        <TextInput
          type="text"
          placeholder={EDIT_GROUP_NAME_PLACEHOLDER}
          value={name}
          onChange={setName}
          disabled={savingName}
          className={EDIT_GROUP_INPUT_CLASS}
        />
        <SubmitButton
          label={EDIT_GROUP_NAME_SAVE_LABEL}
          loadingLabel={EDIT_GROUP_NAME_SAVING_LABEL}
          isLoading={savingName}
          className={EDIT_GROUP_PRIMARY_BUTTON_CLASS}
        />
      </form>
    </section>
  )
}
