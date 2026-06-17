import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useToastContext } from '@/features/app/Toast/context/ToastContext'
import { ApiRequestError } from '@/api/client'
import { profileApi } from '@/features/profile/api/profile.api'
import {
  PROFILE_EMAIL_SAVED_TOAST,
  PROFILE_EMAIL_ERROR_TAKEN,
  PROFILE_EMAIL_ERROR_API,
} from '../../../ProfileScreen.constants'
import type { EmailFormContextValue } from '../EmailForm.types'

export function useEmailForm(): EmailFormContextValue {
  const { user, updateUser } = useAuth()
  const { showToast } = useToastContext()

  const [email, setEmail] = useState(user?.email ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const save = async (): Promise<void> => {
    setError(null)
    setSaving(true)
    try {
      const { user: updated } = await profileApi.updateProfile({ email: email.trim() })
      updateUser(updated)
      showToast(PROFILE_EMAIL_SAVED_TOAST)
    } catch (err) {
      setError(
        err instanceof ApiRequestError && err.status === 409
          ? PROFILE_EMAIL_ERROR_TAKEN
          : PROFILE_EMAIL_ERROR_API,
      )
    } finally {
      setSaving(false)
    }
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    void save()
  }

  return { email, error, saving, setEmail, onSubmit }
}
