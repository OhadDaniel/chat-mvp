import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useToastContext } from '@/features/app/Toast/context/ToastContext'
import { profileApi } from '@/features/profile/api/profile.api'
import {
  PROFILE_AVATAR_SAVED_TOAST,
  PROFILE_AVATAR_REMOVED_TOAST,
  PROFILE_AVATAR_ERROR_API,
  PROFILE_AVATAR_TOO_LARGE,
  AVATAR_MAX_BYTES,
} from '../../../ProfileScreen.constants'
import type { AvatarContextValue } from '../AvatarSection.types'

export function useAvatar(): AvatarContextValue {
  const { user, updateUser } = useAuth()
  const { showToast } = useToastContext()

  const [busy, setBusy] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File): Promise<void> => {
    if (file.size > AVATAR_MAX_BYTES) {
      showToast(PROFILE_AVATAR_TOO_LARGE)
      return
    }
    setBusy(true)
    try {
      const { url, fields, key } = await profileApi.requestAvatarUpload({ contentType: file.type })
      await profileApi.uploadToPresignedPost(url, fields, file)
      const { user: updated } = await profileApi.setAvatar({ key })
      updateUser(updated)
      showToast(PROFILE_AVATAR_SAVED_TOAST)
    } catch {
      showToast(PROFILE_AVATAR_ERROR_API)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (): Promise<void> => {
    setBusy(true)
    try {
      const { user: updated } = await profileApi.removeAvatar()
      updateUser(updated)
      showToast(PROFILE_AVATAR_REMOVED_TOAST)
    } catch {
      showToast(PROFILE_AVATAR_ERROR_API)
    } finally {
      setBusy(false)
    }
  }

  const openFilePicker = (): void => {
    fileInputRef.current?.click()
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file) void upload(file)
    e.target.value = ''
  }

  const onRemove = (): void => {
    void remove()
  }

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
