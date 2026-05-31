import type { User } from '@/features/user/types'

export function getOtherParticipant(participants: User[], currentUserId: string): User {
  return participants.find(p => p.id !== currentUserId) ?? participants[0]
}

export function formatTime(isoString: string | null): string {
  if (!isoString) return ''

  const diffMs      = Date.now() - new Date(isoString).getTime()
  const diffMinutes = Math.floor(diffMs / 1000 / 60)
  const diffHours   = Math.floor(diffMinutes / 60)
  const diffDays    = Math.floor(diffHours / 24)

  if (diffMinutes < 1)  return 'now'
  if (diffMinutes < 60) return `${diffMinutes}m`
  if (diffHours   < 24) return `${diffHours}h`
  if (diffDays    < 7)  return `${diffDays}d`
  return `${Math.floor(diffDays / 7)}w`
}
