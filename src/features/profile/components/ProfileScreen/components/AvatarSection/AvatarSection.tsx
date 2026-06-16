import { useProfileContext } from '../../ProfileScreen.context'
import { UserAvatar }         from '@/features/user/components/UserAvatar/UserAvatar'
import { ProfileSection }     from '../shared/ProfileSection/ProfileSection'
import { UploadButton }       from './components/UploadButton/UploadButton'
import { RemoveButton }       from './components/RemoveButton/RemoveButton'
import { AvatarFileInput }    from './components/AvatarFileInput/AvatarFileInput'
import { PROFILE_AVATAR_SECTION_TITLE, PROFILE_AVATAR_ACTIONS_CLASS } from '../../ProfileScreen.constants'

export function AvatarSection() {
  const {
    avatarUrl,
    avatarInitials,
    avatarName,
    hasAvatar,
    avatarBusy,
    fileInputRef,
    openFilePicker,
    onAvatarChange,
    onRemoveAvatar,
  } = useProfileContext()

  return (
    <ProfileSection title={PROFILE_AVATAR_SECTION_TITLE}>
      <div className={PROFILE_AVATAR_ACTIONS_CLASS}>
        <UserAvatar initials={avatarInitials} name={avatarName} avatarUrl={avatarUrl} size="lg" />
        <UploadButton onClick={openFilePicker} disabled={avatarBusy} />
        {hasAvatar && <RemoveButton onClick={onRemoveAvatar} disabled={avatarBusy} />}
        <AvatarFileInput inputRef={fileInputRef} onChange={onAvatarChange} />
      </div>
    </ProfileSection>
  )
}
