import type { EditTutorAvatarUploadButtonProps } from '../EditTutor.types'
import { EDIT_TUTOR_PRIMARY_BUTTON_CLASS } from '../EditTutor.constants'

export function EditTutorAvatarUploadButton({ label, busy, onClick }: EditTutorAvatarUploadButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={EDIT_TUTOR_PRIMARY_BUTTON_CLASS}
    >
      {label}
    </button>
  )
}
