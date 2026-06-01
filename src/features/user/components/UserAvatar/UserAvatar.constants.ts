import type { AvatarSize } from './UserAvatar.types'

export const AVATAR_COLORS = [
  'bg-violet-500/20 text-violet-300',
  'bg-emerald-500/20 text-emerald-300',
  'bg-rose-500/20 text-rose-300',
  'bg-sky-500/20 text-sky-300',
  'bg-amber-500/20 text-amber-300',
]

export const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
  xl: 'w-14 h-14 text-lg',
}

const AVATAR_BASE_CLASS = 'rounded-full flex items-center justify-center font-bold shrink-0 ring-1 ring-white/10'

export function buildAvatarClassName(initials: string, size: AvatarSize): string {
  const color = AVATAR_COLORS[initials.charCodeAt(0) % AVATAR_COLORS.length]
  return [AVATAR_BASE_CLASS, color, SIZE_CLASSES[size]].join(' ')
}
