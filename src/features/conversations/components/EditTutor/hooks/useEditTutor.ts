import { useState } from 'react'
import type { FormEvent } from 'react'
import { useToastContext } from '@/features/app/Toast/context/ToastContext'
import { conversationsApi } from '@/features/conversations/api/conversations.api'
import { useConversationsContext } from '@/features/conversations/context/conversations.context'
import { useAvatarUpload } from '@/shared/hooks/useAvatarUpload'
import type { TutorConversation } from '@/features/conversations/types'
import {
  EDIT_TUTOR_AVATAR_MAX_BYTES,
  EDIT_TUTOR_AVATAR_TOO_LARGE,
  EDIT_TUTOR_AVATAR_SAVED_TOAST,
  EDIT_TUTOR_AVATAR_REMOVED_TOAST,
  EDIT_TUTOR_NAME_SAVED_TOAST,
  EDIT_TUTOR_ERROR_TOAST,
} from '../EditTutor.constants'

export function useEditTutor(tutor: TutorConversation) {
  const { showToast } = useToastContext()
  const { updateConversation } = useConversationsContext()

  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(tutor.name)
  const [savingName, setSavingName] = useState(false)

  const open = (): void => setIsOpen(true)
  const close = (): void => setIsOpen(false)

  const canSaveName = name.trim().length > 0 && name.trim() !== tutor.name && !savingName

  const saveName = async (): Promise<void> => {
    setSavingName(true)
    try {
      const { conversation } = await conversationsApi.renameTutor(tutor.id, { name: name.trim() })
      updateConversation(conversation)
      showToast(EDIT_TUTOR_NAME_SAVED_TOAST)
    } catch {
      showToast(EDIT_TUTOR_ERROR_TOAST)
    } finally {
      setSavingName(false)
    }
  }

  const onSubmitName = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (canSaveName) void saveName()
  }

  const avatar = useAvatarUpload({
    maxBytes: EDIT_TUTOR_AVATAR_MAX_BYTES,
    messages: {
      tooLarge: EDIT_TUTOR_AVATAR_TOO_LARGE,
      saved:    EDIT_TUTOR_AVATAR_SAVED_TOAST,
      removed:  EDIT_TUTOR_AVATAR_REMOVED_TOAST,
      error:    EDIT_TUTOR_ERROR_TOAST,
    },
    requestUpload: contentType => conversationsApi.requestTutorAvatarUpload(tutor.id, { contentType }),
    setAvatar:     () => conversationsApi.setTutorAvatar(tutor.id),
    removeAvatar:  () => conversationsApi.removeTutorAvatar(tutor.id),
    onSaved:       ({ conversation }) => updateConversation(conversation),
    onRemoved:     ({ conversation }) => updateConversation(conversation),
  })

  return {
    tutor,
    isOpen,
    open,
    close,
    name,
    setName,
    savingName,
    canSaveName,
    onSubmitName,
    avatar,
  }
}
