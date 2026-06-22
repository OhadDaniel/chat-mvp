import { useState } from 'react'
import type { FormEvent } from 'react'
import { useToastContext } from '@/features/app/Toast/context/ToastContext'
import { conversationsApi } from '@/features/conversations/api/conversations.api'
import { useConversationsContext } from '@/features/conversations/context/conversations.context'
import { useAvatarUpload } from '@/shared/hooks/useAvatarUpload'
import type { GroupConversation } from '@/features/conversations/types'
import {
  EDIT_GROUP_AVATAR_MAX_BYTES,
  EDIT_GROUP_AVATAR_TOO_LARGE,
  EDIT_GROUP_AVATAR_SAVED_TOAST,
  EDIT_GROUP_AVATAR_REMOVED_TOAST,
  EDIT_GROUP_NAME_SAVED_TOAST,
  EDIT_GROUP_ERROR_TOAST,
} from '../EditGroup.constants'

export function useEditGroup(group: GroupConversation) {
  const { showToast } = useToastContext()
  const { updateConversation } = useConversationsContext()

  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(group.name)
  const [savingName, setSavingName] = useState(false)

  const open = (): void => setIsOpen(true)
  const close = (): void => setIsOpen(false)

  const canSaveName = name.trim().length > 0 && name.trim() !== group.name && !savingName

  const saveName = async (): Promise<void> => {
    setSavingName(true)
    try {
      const { conversation } = await conversationsApi.renameGroup(group.id, { name: name.trim() })
      updateConversation(conversation)
      showToast(EDIT_GROUP_NAME_SAVED_TOAST)
    } catch {
      showToast(EDIT_GROUP_ERROR_TOAST)
    } finally {
      setSavingName(false)
    }
  }

  const onSubmitName = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (canSaveName) void saveName()
  }

  const avatar = useAvatarUpload({
    maxBytes: EDIT_GROUP_AVATAR_MAX_BYTES,
    messages: {
      tooLarge: EDIT_GROUP_AVATAR_TOO_LARGE,
      saved:    EDIT_GROUP_AVATAR_SAVED_TOAST,
      removed:  EDIT_GROUP_AVATAR_REMOVED_TOAST,
      error:    EDIT_GROUP_ERROR_TOAST,
    },
    requestUpload: contentType => conversationsApi.requestGroupAvatarUpload(group.id, { contentType }),
    setAvatar:     () => conversationsApi.setGroupAvatar(group.id),
    removeAvatar:  () => conversationsApi.removeGroupAvatar(group.id),
    onSaved:       ({ conversation }) => updateConversation(conversation),
    onRemoved:     ({ conversation }) => updateConversation(conversation),
  })

  return {
    group,
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
