export type ConversationItemProps = {
  initials:    string
  name:        string
  lastMessage: string
  time:        string
  unreadCount: number
  isPinned:    boolean
  isSelected:  boolean
  onTogglePin: () => void
  onSelect:    () => void
}
