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
