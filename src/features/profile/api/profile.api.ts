import { request } from '@/api/client'
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  RequestAvatarUploadRequest,
  RequestAvatarUploadResponse,
  SetAvatarRequest,
  SetAvatarResponse,
  RemoveAvatarResponse,
} from './profile.types'

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
