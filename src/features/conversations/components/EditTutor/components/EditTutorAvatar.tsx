import { UserAvatar } from '@/features/user/components/UserAvatar/UserAvatar'
import { EditTutorAvatarUploadButton } from './EditTutorAvatarUploadButton'
import { EditTutorRemoveAvatarButton } from './EditTutorRemoveAvatarButton'
import type { EditTutorAvatarProps } from '../EditTutor.types'
import {
  EDIT_TUTOR_PHOTO_LABEL,
  EDIT_TUTOR_AVATAR_ACCEPT,
  EDIT_TUTOR_SECTION_CLASS,
  EDIT_TUTOR_SECTION_LABEL_CLASS,
  EDIT_TUTOR_PHOTO_ROW_CLASS,
  EDIT_TUTOR_PHOTO_ACTIONS_CLASS,
  EDIT_TUTOR_FILE_INPUT_CLASS,
} from '../EditTutor.constants'

export function EditTutorAvatar({
  name,
  initials,
  avatarUrl,
  hasPhoto,
  busy,
  uploadLabel,
  fileInputRef,
  onPick,
  onFileChange,
  onRemove,
}: EditTutorAvatarProps) {
  return (
    <section className={EDIT_TUTOR_SECTION_CLASS}>
      <h3 className={EDIT_TUTOR_SECTION_LABEL_CLASS}>{EDIT_TUTOR_PHOTO_LABEL}</h3>
      <div className={EDIT_TUTOR_PHOTO_ROW_CLASS}>
        <UserAvatar name={name} initials={initials} avatarUrl={avatarUrl} size="lg" />
        <div className={EDIT_TUTOR_PHOTO_ACTIONS_CLASS}>
          <EditTutorAvatarUploadButton label={uploadLabel} busy={busy} onClick={onPick} />
          {hasPhoto ? <EditTutorRemoveAvatarButton busy={busy} onClick={onRemove} /> : null}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={EDIT_TUTOR_AVATAR_ACCEPT}
        onChange={onFileChange}
        className={EDIT_TUTOR_FILE_INPUT_CLASS}
      />
    </section>
  )
}
