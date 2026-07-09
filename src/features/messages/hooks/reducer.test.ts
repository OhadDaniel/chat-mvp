import { describe, it, expect } from 'vitest'
import { messagesReducer, initialState } from './reducer'
import { MESSAGES_ACTIONS, MESSAGES_STATUS } from '../constants'
import type { Message } from '../types'

const makeMessage = (overrides: Partial<Message> = {}): Message => ({
  id:             'msg-1',
  conversationId: 'conv-1',
  sender:         { id: 'user-1', email: 'alice@chat.dev', firstName: 'Alice', lastName: 'Levi', name: 'Alice', avatarInitials: 'AL', avatarUrl: null },
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

  it('APPEND_DELTA appends streamed text to the matching message', () => {
    const placeholder = makeMessage({ id: 'temp-assistant', content: '', status: 'sending' })
    const withPlaceholder = messagesReducer(initialState, {
      type:    MESSAGES_ACTIONS.ADD_MESSAGE,
      payload: placeholder,
    })

    const afterFirst = messagesReducer(withPlaceholder, {
      type:    MESSAGES_ACTIONS.APPEND_DELTA,
      payload: { id: 'temp-assistant', text: 'Hel' },
    })
    const afterSecond = messagesReducer(afterFirst, {
      type:    MESSAGES_ACTIONS.APPEND_DELTA,
      payload: { id: 'temp-assistant', text: 'lo' },
    })

    expect(afterSecond.messages[0].content).toBe('Hello')
  })

  it('TOOL_STARTED records the active tool', () => {
    const state = messagesReducer(initialState, {
      type:    MESSAGES_ACTIONS.TOOL_STARTED,
      payload: { name: 'retrieve_docs' },
    })

    expect(state.toolActivity).toEqual({ name: 'retrieve_docs' })
  })

  it('TOOL_FINISHED clears the active tool', () => {
    const running = messagesReducer(initialState, {
      type:    MESSAGES_ACTIONS.TOOL_STARTED,
      payload: { name: 'summarize_my_recent_messages' },
    })

    const cleared = messagesReducer(running, {
      type: MESSAGES_ACTIONS.TOOL_FINISHED,
    })

    expect(cleared.toolActivity).toBeNull()
  })
})
