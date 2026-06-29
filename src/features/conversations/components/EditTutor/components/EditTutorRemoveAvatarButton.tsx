import type { EditTutorRemoveAvatarButtonProps } from '../EditTutor.types'
import { EDIT_TUTOR_REMOVE_LABEL, EDIT_TUTOR_SECONDARY_BUTTON_CLASS } from '../EditTutor.constants'

export function EditTutorRemoveAvatarButton({ busy, onClick }: EditTutorRemoveAvatarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={EDIT_TUTOR_SECONDARY_BUTTON_CLASS}
    >
      {EDIT_TUTOR_REMOVE_LABEL}
    </button>
  )
}
