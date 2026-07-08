import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useToastContext } from '@/features/app/Toast/context/ToastContext'
import { uploadToPresignedPost } from '@/api/uploadToPresignedPost'

export type AvatarUploadMessages = {
  tooLarge: string
  saved:    string
  removed:  string
  error:    string
}

type PresignedUpload = {
  url:    string
  fields: Record<string, string>
}

type UseAvatarUploadParams<TSaved, TRemoved> = {
  maxBytes:      number
  messages:      AvatarUploadMessages
  requestUpload: (contentType: string) => Promise<PresignedUpload>
  setAvatar:     () => Promise<TSaved>
  removeAvatar:  () => Promise<TRemoved>
  onSaved:       (result: TSaved) => void
  onRemoved:     (result: TRemoved) => void
}

export function useAvatarUpload<TSaved, TRemoved>({
  maxBytes,
  messages,
  requestUpload,
  setAvatar,
  removeAvatar,
  onSaved,
  onRemoved,
}: UseAvatarUploadParams<TSaved, TRemoved>) {
  const { showToast } = useToastContext()

  const [busy, setBusy] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File): Promise<void> => {
    if (file.size > maxBytes) {
      showToast(messages.tooLarge)
      return
    }
    setBusy(true)
    try {
      const { url, fields } = await requestUpload(file.type)
      await uploadToPresignedPost(url, fields, file)
      onSaved(await setAvatar())
      showToast(messages.saved)
    } catch {
      showToast(messages.error)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (): Promise<void> => {
    setBusy(true)
    try {
      onRemoved(await removeAvatar())
      showToast(messages.removed)
    } catch {
      showToast(messages.error)
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

  return { busy, fileInputRef, openFilePicker, onFileChange, onRemove }
}
