import { GroupAvatar } from '@/features/conversations/components/GroupAvatar/GroupAvatar'
import { useEditGroupContext } from '../EditGroup.context'
import {
  EDIT_GROUP_PHOTO_LABEL,
  EDIT_GROUP_UPLOAD_LABEL,
  EDIT_GROUP_REPLACE_LABEL,
  EDIT_GROUP_REMOVE_LABEL,
  EDIT_GROUP_AVATAR_ACCEPT,
  EDIT_GROUP_SECTION_CLASS,
  EDIT_GROUP_SECTION_LABEL_CLASS,
  EDIT_GROUP_PHOTO_ROW_CLASS,
  EDIT_GROUP_PHOTO_ACTIONS_CLASS,
  EDIT_GROUP_PRIMARY_BUTTON_CLASS,
  EDIT_GROUP_SECONDARY_BUTTON_CLASS,
  EDIT_GROUP_FILE_INPUT_CLASS,
} from '../EditGroup.constants'

export function EditGroupAvatar() {
  const { group, avatar } = useEditGroupContext()
  const { busy, fileInputRef, openFilePicker, onFileChange, onRemove } = avatar
  const hasPhoto = group.avatarUrl !== null

  return (
    <section className={EDIT_GROUP_SECTION_CLASS}>
      <h3 className={EDIT_GROUP_SECTION_LABEL_CLASS}>{EDIT_GROUP_PHOTO_LABEL}</h3>
      <div className={EDIT_GROUP_PHOTO_ROW_CLASS}>
        <GroupAvatar name={group.name} avatarUrl={group.avatarUrl} size="lg" />
        <div className={EDIT_GROUP_PHOTO_ACTIONS_CLASS}>
          <button
            type="button"
            onClick={openFilePicker}
            disabled={busy}
            className={EDIT_GROUP_PRIMARY_BUTTON_CLASS}
          >
            {hasPhoto ? EDIT_GROUP_REPLACE_LABEL : EDIT_GROUP_UPLOAD_LABEL}
          </button>
          {hasPhoto && (
            <button
              type="button"
              onClick={onRemove}
              disabled={busy}
              className={EDIT_GROUP_SECONDARY_BUTTON_CLASS}
            >
              {EDIT_GROUP_REMOVE_LABEL}
            </button>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={EDIT_GROUP_AVATAR_ACCEPT}
        onChange={onFileChange}
        className={EDIT_GROUP_FILE_INPUT_CLASS}
      />
    </section>
  )
}
