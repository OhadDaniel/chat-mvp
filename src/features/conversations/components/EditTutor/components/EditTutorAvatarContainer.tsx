import { useEditTutorContext } from '../EditTutor.context'
import { EditTutorAvatar } from './EditTutorAvatar'
import { EDIT_TUTOR_UPLOAD_LABEL, EDIT_TUTOR_REPLACE_LABEL } from '../EditTutor.constants'

export function EditTutorAvatarContainer() {
  const { tutor, avatar } = useEditTutorContext()
  const hasPhoto = tutor.avatarUrl !== null
  const initials = tutor.name.trim().charAt(0).toUpperCase()
  const uploadLabel = hasPhoto ? EDIT_TUTOR_REPLACE_LABEL : EDIT_TUTOR_UPLOAD_LABEL

  return (
    <EditTutorAvatar
      name={tutor.name}
      initials={initials}
      avatarUrl={tutor.avatarUrl}
      hasPhoto={hasPhoto}
      busy={avatar.busy}
      uploadLabel={uploadLabel}
      fileInputRef={avatar.fileInputRef}
      onPick={avatar.openFilePicker}
      onFileChange={avatar.onFileChange}
      onRemove={avatar.onRemove}
    />
  )
}
