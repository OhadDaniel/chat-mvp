import type { ReactNode } from 'react'

export type BubbleProps = {
  wrapperClass:        string
  bubbleClass:         string
  contentWrapperClass: string
  timeClass:           string
  content:             string
  time:                string
  senderName:          string
  senderInitials:      string
  senderNameNode:      ReactNode
}

export type BubbleContainerProps = {
  content:        string
  sentAt:         string
  senderName:     string
  senderInitials: string
  isOwn:          boolean
}
