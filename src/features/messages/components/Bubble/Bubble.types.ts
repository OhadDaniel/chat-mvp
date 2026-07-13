export type BubbleClasses = {
  wrapper:        string
  bubble:         string
  contentWrapper: string
  time:           string
}

import type { Citation } from '@/features/messages/types'

export type BubbleProps = {
  classes:         BubbleClasses
  content:         string
  time:            string
  senderName:      string
  senderInitials:  string
  senderAvatarUrl: string | null
  showSenderName:  boolean
  citations:       Citation[]
}

export type BubbleContainerProps = {
  content:         string
  sentAt:          string
  senderName:      string
  senderInitials:  string
  senderAvatarUrl: string | null
  isFromCurrentUser:          boolean
  citations:       Citation[]
}
