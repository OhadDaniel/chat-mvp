import { describe, it, expect } from 'vitest'
import { getConversationDisplay } from './conversations.utils'
import { ASSISTANT_AVATAR_URL } from '@/shared/constants'
import {
  ASSISTANT_DISPLAY_TITLE,
  ASSISTANT_DISPLAY_INITIALS,
} from '../constants'
import type { AssistantConversation } from '../types'

const assistantConversation: AssistantConversation = {
  id:            'conv-ai',
  type:          'assistant',
  participants:  [
    { id: 'user-1', name: 'Ohad', avatarInitials: 'OD', avatarUrl: null },
  ],
  lastMessage:   null,
  lastMessageAt: null,
  pinnedAt:      null,
  unreadCount:   0,
}

describe('getConversationDisplay (assistant)', () => {
  it('renders the Maxwell identity for an assistant conversation', () => {
    const display = getConversationDisplay(assistantConversation, 'user-1')

    expect(display).toEqual({
      title:     ASSISTANT_DISPLAY_TITLE,
      avatarUrl: ASSISTANT_AVATAR_URL,
      initials:  ASSISTANT_DISPLAY_INITIALS,
      isGroup:   false,
    })
  })
})
