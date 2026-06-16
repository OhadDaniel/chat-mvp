import type { ChangeEvent, FormEvent, RefObject } from 'react'

export type ProfileContextValue = {
  firstName:    string
  lastName:     string
  nameError:    string | null
  nameSaving:   boolean
  setFirstName: (value: string) => void
  setLastName:  (value: string) => void
  onSubmitName: (e: FormEvent<HTMLFormElement>) => void

  email:         string
  emailError:    string | null
  emailSaving:   boolean
  setEmail:      (value: string) => void
  onSubmitEmail: (e: FormEvent<HTMLFormElement>) => void

  avatarUrl:      string | null
  avatarInitials: string
  avatarName:     string
  hasAvatar:      boolean
  avatarBusy:     boolean
  fileInputRef:   RefObject<HTMLInputElement | null>
  openFilePicker: () => void
  onAvatarChange: (e: ChangeEvent<HTMLInputElement>) => void
  onRemoveAvatar: () => void
}
