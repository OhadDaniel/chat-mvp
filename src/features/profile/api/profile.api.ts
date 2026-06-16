import { request } from '@/api/client'
import type { User } from '@/features/user/types'

export type UpdateProfileRequest = {
  firstName?: string
  lastName?:  string
  email?:     string
}

export type UpdateProfileResponse = {
  user: User
}

export type RequestAvatarUploadRequest = {
  contentType: string
}

export type RequestAvatarUploadResponse = {
  uploadUrl: string
  key:       string
}

export type SetAvatarRequest = {
  key: string
}

export type SetAvatarResponse = {
  user: User
}

export type RemoveAvatarResponse = {
  user: User
}

export const profileApi = {
  updateProfile: (body: UpdateProfileRequest): Promise<UpdateProfileResponse> =>
    request('/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  requestAvatarUpload: (body: RequestAvatarUploadRequest): Promise<RequestAvatarUploadResponse> =>
    request('/me/avatar/upload-url', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  setAvatar: (body: SetAvatarRequest): Promise<SetAvatarResponse> =>
    request('/me/avatar', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  removeAvatar: (): Promise<RemoveAvatarResponse> =>
    request('/me/avatar', {
      method: 'DELETE',
    }),

  uploadToPresignedUrl: async (uploadUrl: string, file: File): Promise<void> => {
    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    })
    if (!res.ok) throw new Error(`Avatar upload failed: ${res.status}`)
  },
}
