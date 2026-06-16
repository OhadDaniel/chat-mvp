import { useRef, useState }            from 'react'
import type { ChangeEvent, FormEvent }  from 'react'
import { useAuth }                      from '@/features/auth/hooks/useAuth'
import { useToastContext }              from '@/features/app/Toast/context/ToastContext'
import { ApiRequestError }              from '@/api/client'
import { profileApi }                   from '@/features/profile/api/profile.api'
import {
  PROFILE_NAME_SAVED_TOAST,
  PROFILE_EMAIL_SAVED_TOAST,
  PROFILE_AVATAR_SAVED_TOAST,
  PROFILE_AVATAR_REMOVED_TOAST,
  PROFILE_NAME_ERROR_API,
  PROFILE_EMAIL_ERROR_TAKEN,
  PROFILE_EMAIL_ERROR_API,
  PROFILE_AVATAR_ERROR_API,
} from '../ProfileScreen.constants'
import type { ProfileContextValue } from '../ProfileScreen.types'

export function useProfile(): ProfileContextValue {
  const { user, updateUser } = useAuth()
  const { showToast }        = useToastContext()

  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName,  setLastName]  = useState(user?.lastName ?? '')
  const [email,     setEmail]     = useState(user?.email ?? '')

  const [nameError,   setNameError]   = useState<string | null>(null)
  const [nameSaving,  setNameSaving]  = useState(false)
  const [emailError,  setEmailError]  = useState<string | null>(null)
  const [emailSaving, setEmailSaving] = useState(false)
  const [avatarBusy,  setAvatarBusy]  = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const saveName = async (): Promise<void> => {
    setNameError(null)
    setNameSaving(true)
    try {
      const { user: updated } = await profileApi.updateProfile({
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
      })
      updateUser(updated)
      showToast(PROFILE_NAME_SAVED_TOAST)
    } catch {
      setNameError(PROFILE_NAME_ERROR_API)
    } finally {
      setNameSaving(false)
    }
  }

  const saveEmail = async (): Promise<void> => {
    setEmailError(null)
    setEmailSaving(true)
    try {
      const { user: updated } = await profileApi.updateProfile({ email: email.trim() })
      updateUser(updated)
      showToast(PROFILE_EMAIL_SAVED_TOAST)
    } catch (err) {
      setEmailError(
        err instanceof ApiRequestError && err.status === 409
          ? PROFILE_EMAIL_ERROR_TAKEN
          : PROFILE_EMAIL_ERROR_API,
      )
    } finally {
      setEmailSaving(false)
    }
  }

  const uploadAvatar = async (file: File): Promise<void> => {
    setAvatarBusy(true)
    try {
      const { uploadUrl, key } = await profileApi.requestAvatarUpload({ contentType: file.type })
      await profileApi.uploadToPresignedUrl(uploadUrl, file)
      const { user: updated } = await profileApi.setAvatar({ key })
      updateUser(updated)
      showToast(PROFILE_AVATAR_SAVED_TOAST)
    } catch {
      showToast(PROFILE_AVATAR_ERROR_API)
    } finally {
      setAvatarBusy(false)
    }
  }

  const removeAvatar = async (): Promise<void> => {
    setAvatarBusy(true)
    try {
      const { user: updated } = await profileApi.removeAvatar()
      updateUser(updated)
      showToast(PROFILE_AVATAR_REMOVED_TOAST)
    } catch {
      showToast(PROFILE_AVATAR_ERROR_API)
    } finally {
      setAvatarBusy(false)
    }
  }

  const onSubmitName = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    void saveName()
  }

  const onSubmitEmail = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    void saveEmail()
  }

  const openFilePicker = (): void => {
    fileInputRef.current?.click()
  }

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file) void uploadAvatar(file)
    e.target.value = ''
  }

  const onRemoveAvatar = (): void => {
    void removeAvatar()
  }

  return {
    firstName,
    lastName,
    nameError,
    nameSaving,
    setFirstName,
    setLastName,
    onSubmitName,

    email,
    emailError,
    emailSaving,
    setEmail,
    onSubmitEmail,

    avatarUrl:      user?.avatarUrl ?? null,
    avatarInitials: user?.avatarInitials ?? '',
    avatarName:     user?.name ?? '',
    hasAvatar:      Boolean(user?.avatarUrl),
    avatarBusy,
    fileInputRef,
    openFilePicker,
    onAvatarChange,
    onRemoveAvatar,
  }
}
