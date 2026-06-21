import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useToastContext } from '@/features/app/Toast/context/ToastContext'
import { profileApi } from '@/features/profile/api/profile.api'
import {
  PROFILE_NAME_SAVED_TOAST,
  PROFILE_NAME_ERROR_API,
} from '../../../ProfileScreen.constants'

export function useNameForm() {
  const { user, updateUser } = useAuth()
  const { showToast } = useToastContext()

  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const save = async (): Promise<void> => {
    setError(null)
    setSaving(true)
    try {
      const { user: updated } = await profileApi.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      })
      updateUser(updated)
      showToast(PROFILE_NAME_SAVED_TOAST)
    } catch {
      setError(PROFILE_NAME_ERROR_API)
    } finally {
      setSaving(false)
    }
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    void save()
  }

  return { firstName, lastName, error, saving, setFirstName, setLastName, onSubmit }
}
