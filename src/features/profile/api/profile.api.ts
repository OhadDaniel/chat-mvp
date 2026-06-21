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
}
