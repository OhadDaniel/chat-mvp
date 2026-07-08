import { describe, it, expect, vi }   from 'vitest'
import { render, screen }              from '@testing-library/react'
import userEvent                       from '@testing-library/user-event'
import { EditGroup }                   from './EditGroup'
import { EditGroupContext }            from './EditGroup.context'
import type { EditGroupContextValue }  from './EditGroup.types'
import type { GroupConversation }      from '@/features/conversations/types'

const group: GroupConversation = {
  id:            'conv-1',
  type:          'group',
  name:          'Fellowship Crew',
  createdBy:     'user-1',
  avatarUrl:     null,
  participants:  [],
  lastMessage:   null,
  lastMessageAt: null,
  pinnedAt:      null,
  unreadCount:   0,
}

const baseValue: EditGroupContextValue = {
  group,
  isOpen:       false,
  open:         vi.fn(),
  close:        vi.fn(),
  name:         group.name,
  setName:      vi.fn(),
  savingName:   false,
  canSaveName:  false,
  onSubmitName: vi.fn(e => e.preventDefault()),
  avatar: {
    busy:           false,
    fileInputRef:   { current: null },
    openFilePicker: vi.fn(),
    onFileChange:   vi.fn(),
    onRemove:       vi.fn(),
  },
}

function renderWith(overrides: Partial<EditGroupContextValue> = {}) {
  return render(
    <EditGroupContext.Provider value={{ ...baseValue, ...overrides }}>
      <EditGroup />
    </EditGroupContext.Provider>,
  )
}

describe('EditGroup', () => {
  it('opens the settings modal from the gear', async () => {
    const open = vi.fn()
    const user = userEvent.setup()

    renderWith({ open })
    await user.click(screen.getByRole('button', { name: /group settings/i }))

    expect(open).toHaveBeenCalledOnce()
  })

  it('shows the current name and an upload action when there is no photo', () => {
    renderWith({ isOpen: true })

    expect(screen.getByDisplayValue('Fellowship Crew')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /upload photo/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
  })

  it('shows replace and remove actions when the group has a photo', () => {
    renderWith({ isOpen: true, group: { ...group, avatarUrl: 'https://cdn.test/g.png' } })

    expect(screen.getByRole('button', { name: /replace photo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument()
  })

  it('opens the file picker from the upload button', async () => {
    const openFilePicker = vi.fn()
    const user           = userEvent.setup()

    renderWith({ isOpen: true, avatar: { ...baseValue.avatar, openFilePicker } })
    await user.click(screen.getByRole('button', { name: /upload photo/i }))

    expect(openFilePicker).toHaveBeenCalledOnce()
  })
})
