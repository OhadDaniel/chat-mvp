import type { ChangeEvent, FormEvent, RefObject } from 'react'
import type { useEditTutor } from './hooks/useEditTutor'

export type EditTutorContextValue = ReturnType<typeof useEditTutor>

export type EditTutorTriggerProps = {
  onOpen: () => void
}

export type EditTutorNameProps = {
  name:         string
  setName:      (value: string) => void
  savingName:   boolean
  onSubmitName: (event: FormEvent<HTMLFormElement>) => void
}

export type EditTutorAvatarProps = {
  name:         string
  initials:     string
  avatarUrl:    string | null
  hasPhoto:     boolean
  busy:         boolean
  uploadLabel:  string
  fileInputRef: RefObject<HTMLInputElement | null>
  onPick:       () => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRemove:     () => void
}

export type EditTutorAvatarUploadButtonProps = {
  label:   string
  busy:    boolean
  onClick: () => void
}

export type EditTutorRemoveAvatarButtonProps = {
  busy:    boolean
  onClick: () => void
}
