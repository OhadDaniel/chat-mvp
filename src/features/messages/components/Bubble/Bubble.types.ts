export type BubbleClasses = {
  wrapper:        string
  bubble:         string
  contentWrapper: string
  time:           string
}

export type BubbleProps = {
  classes:        BubbleClasses
  content:        string
  time:           string
  senderName:     string
  senderInitials: string
  showSenderName: boolean
}

export type BubbleContainerProps = {
  content:        string
  sentAt:         string
  senderName:     string
  senderInitials: string
  isFromCurrentUser:          boolean
}
