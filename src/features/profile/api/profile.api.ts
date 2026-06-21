import { request } from '@/api/client'
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  RequestAvatarUploadRequest,
  RequestAvatarUploadResponse,
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

  setAvatar: (): Promise<SetAvatarResponse> =>
    request('/me/avatar', {
      method: 'PUT',
    }),

  removeAvatar: (): Promise<RemoveAvatarResponse> =>
    request('/me/avatar', {
      method: 'DELETE',
    }),

  uploadToPresignedPost: async (
    url: string,
    fields: Record<string, string>,
    file: File,
  ): Promise<void> => {
    const form = new FormData()
    Object.entries(fields).forEach(([name, value]) => form.append(name, value))
    form.append('file', file) // S3 requires the file field to be appended last
    const res = await fetch(url, { method: 'POST', body: form })
    if (!res.ok) throw new Error(`Avatar upload failed: ${res.status}`)
  },
}
