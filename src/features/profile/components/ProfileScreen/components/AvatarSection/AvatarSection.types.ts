import type { ChangeEvent, RefObject } from 'react'

export type AvatarContextValue = {
  avatarUrl:      string | null
  avatarInitials: string
  avatarName:     string
  hasAvatar:      boolean
  busy:           boolean
  fileInputRef:   RefObject<HTMLInputElement | null>
  openFilePicker: () => void
  onFileChange:   (e: ChangeEvent<HTMLInputElement>) => void
  onRemove:       () => void
}
