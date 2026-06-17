import { useAvatarContext } from './AvatarSection.context'
import { UserAvatar }       from '@/features/user/components/UserAvatar/UserAvatar'
import { ProfileSection }   from '../shared/ProfileSection/ProfileSection'
import { UploadButton }     from './components/UploadButton/UploadButton'
import { RemoveButton }     from './components/RemoveButton/RemoveButton'
import {
  PROFILE_AVATAR_SECTION_TITLE,
  PROFILE_AVATAR_ACTIONS_CLASS,
  PROFILE_AVATAR_ACCEPT,
  PROFILE_AVATAR_INPUT_CLASS,
} from '../../ProfileScreen.constants'

export function AvatarSection() {
  const {
    avatarUrl,
    avatarInitials,
    avatarName,
    hasAvatar,
    busy,
    fileInputRef,
    openFilePicker,
    onFileChange,
    onRemove,
  } = useAvatarContext()

  return (
    <ProfileSection title={PROFILE_AVATAR_SECTION_TITLE}>
      <div className={PROFILE_AVATAR_ACTIONS_CLASS}>
        <UserAvatar initials={avatarInitials} name={avatarName} avatarUrl={avatarUrl} size="lg" />
        <UploadButton onClick={openFilePicker} disabled={busy} />
        {hasAvatar && <RemoveButton onClick={onRemove} disabled={busy} />}
        <input
          ref={fileInputRef}
          type="file"
          accept={PROFILE_AVATAR_ACCEPT}
          onChange={onFileChange}
          className={PROFILE_AVATAR_INPUT_CLASS}
        />
      </div>
    </ProfileSection>
  )
}
