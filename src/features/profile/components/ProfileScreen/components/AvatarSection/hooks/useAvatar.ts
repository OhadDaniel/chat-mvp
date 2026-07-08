import { useAuth } from '@/features/auth/hooks/useAuth'
import { profileApi } from '@/features/profile/api/profile.api'
import { useAvatarUpload } from '@/shared/hooks/useAvatarUpload'
import {
  PROFILE_AVATAR_SAVED_TOAST,
  PROFILE_AVATAR_REMOVED_TOAST,
  PROFILE_AVATAR_ERROR_API,
  PROFILE_AVATAR_TOO_LARGE,
  AVATAR_MAX_BYTES,
} from '../../../ProfileScreen.constants'

export function useAvatar() {
  const { user, updateUser } = useAuth()

  const { busy, fileInputRef, openFilePicker, onFileChange, onRemove } = useAvatarUpload({
    maxBytes: AVATAR_MAX_BYTES,
    messages: {
      tooLarge: PROFILE_AVATAR_TOO_LARGE,
      saved:    PROFILE_AVATAR_SAVED_TOAST,
      removed:  PROFILE_AVATAR_REMOVED_TOAST,
      error:    PROFILE_AVATAR_ERROR_API,
    },
    requestUpload: contentType => profileApi.requestAvatarUpload({ contentType }),
    setAvatar:     () => profileApi.setAvatar(),
    removeAvatar:  () => profileApi.removeAvatar(),
    onSaved:       ({ user: updated }) => updateUser(updated),
    onRemoved:     ({ user: updated }) => updateUser(updated),
  })

  return {
    avatarUrl:      user?.avatarUrl ?? null,
    avatarInitials: user?.avatarInitials ?? '',
    avatarName:     user?.name ?? '',
    hasAvatar:      Boolean(user?.avatarUrl),
    busy,
    fileInputRef,
    openFilePicker,
    onFileChange,
    onRemove,
  }
}
