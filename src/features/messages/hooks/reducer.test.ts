import { describe, it, expect } from 'vitest'
import { messagesReducer, initialState } from './reducer'
import { MESSAGES_ACTIONS, MESSAGES_STATUS } from '../constants'
import type { Message } from '../types'

const makeMessage = (overrides: Partial<Message> = {}): Message => ({
  id:             'msg-1',
  conversationId: 'conv-1',
  sender:         { id: 'user-1', name: 'Alice', avatarInitials: 'AL' },
  content:        'Hello',
  sentAt:         '2024-01-01T00:00:00.000Z',
  status:         'sent',
  ...overrides,
})

describe('messagesReducer', () => {
  it('ADD_MESSAGE appends the message to the list', () => {
    const message = makeMessage()
    const state   = messagesReducer(initialState, {
      type:    MESSAGES_ACTIONS.ADD_MESSAGE,
      payload: message,
    })

    expect(state.messages).toHaveLength(1)
    expect(state.messages[0]).toEqual(message)
  })

  it('CONFIRM_MESSAGE replaces the temp message with the real one', () => {
    const tempMessage = makeMessage({ id: 'temp-123', status: 'sending' })
    const realMessage = makeMessage({ id: 'msg-real', status: 'sent' })

    const stateWithTemp = messagesReducer(initialState, {
      type:    MESSAGES_ACTIONS.ADD_MESSAGE,
      payload: tempMessage,
    })

    const confirmed = messagesReducer(stateWithTemp, {
      type:    MESSAGES_ACTIONS.CONFIRM_MESSAGE,
      payload: { tempId: 'temp-123', message: realMessage },
    })

    expect(confirmed.messages).toHaveLength(1)
    expect(confirmed.messages[0].id).toBe('msg-real')
  })

  it('REMOVE_MESSAGE removes the message by id', () => {
    const message     = makeMessage({ id: 'temp-456' })
    const stateWithMsg = messagesReducer(initialState, {
      type:    MESSAGES_ACTIONS.ADD_MESSAGE,
      payload: message,
    })

    const removed = messagesReducer(stateWithMsg, {
      type:    MESSAGES_ACTIONS.REMOVE_MESSAGE,
      payload: 'temp-456',
    })

    expect(removed.messages).toHaveLength(0)
  })

  it('SET_STATUS updates the status', () => {
    const state = messagesReducer(initialState, {
      type:    MESSAGES_ACTIONS.SET_STATUS,
      payload: MESSAGES_STATUS.LOADING,
    })

    expect(state.status).toBe(MESSAGES_STATUS.LOADING)
  })
})
