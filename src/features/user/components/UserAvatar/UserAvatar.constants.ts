import type { AvatarSize } from './UserAvatar.types'

export const AVATAR_COLORS = [
  'bg-accent text-white',
  'bg-ink text-white',
  'bg-[#3a3f8f] text-white',
  'bg-[#5b6470] text-white',
  'bg-[#7a7468] text-white',
]

export const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'w-9 h-9 text-sm',
  md: 'w-11 h-11 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-20 h-20 text-2xl',
}

const AVATAR_BASE_CLASS = 'rounded-full flex items-center justify-center font-semibold shrink-0 ring-1 ring-black/5'

export function buildAvatarClassName(initials: string, size: AvatarSize): string {
  const color = AVATAR_COLORS[initials.charCodeAt(0) % AVATAR_COLORS.length]
  return [AVATAR_BASE_CLASS, color, SIZE_CLASSES[size]].join(' ')
}

const AVATAR_IMAGE_BASE_CLASS = 'rounded-full object-cover shrink-0 ring-1 ring-black/5'

export function buildAvatarImageClassName(size: AvatarSize): string {
  return [AVATAR_IMAGE_BASE_CLASS, SIZE_CLASSES[size]].join(' ')
}
