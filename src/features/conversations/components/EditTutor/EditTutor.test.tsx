import { describe, it, expect, vi }   from 'vitest'
import { render, screen }              from '@testing-library/react'
import userEvent                       from '@testing-library/user-event'
import { EditTutor }                   from './EditTutor'
import { EditTutorContext }            from './EditTutor.context'
import type { EditTutorContextValue }  from './EditTutor.types'
import type { TutorConversation }      from '@/features/conversations/types'

const tutor: TutorConversation = {
  id:            'conv-1',
  type:          'tutor',
  name:          'Biology Tutor',
  avatarUrl:     null,
  participants:  [],
  lastMessage:   null,
  lastMessageAt: null,
  pinnedAt:      null,
  unreadCount:   0,
}

const baseValue: EditTutorContextValue = {
  tutor,
  isOpen:       false,
  open:         vi.fn(),
  close:        vi.fn(),
  name:         tutor.name,
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

function renderWith(overrides: Partial<EditTutorContextValue> = {}) {
  return render(
    <EditTutorContext.Provider value={{ ...baseValue, ...overrides }}>
      <EditTutor />
    </EditTutorContext.Provider>,
  )
}

describe('EditTutor', () => {
  it('opens the settings modal from the gear', async () => {
    const open = vi.fn()
    const user = userEvent.setup()

    renderWith({ open })
    await user.click(screen.getByRole('button', { name: /tutor settings/i }))

    expect(open).toHaveBeenCalledOnce()
  })

  it('shows the current name and an upload action when there is no avatar', () => {
    renderWith({ isOpen: true })

    expect(screen.getByDisplayValue('Biology Tutor')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /upload photo/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
  })

  it('shows replace and remove actions when the tutor has an avatar', () => {
    renderWith({ isOpen: true, tutor: { ...tutor, avatarUrl: 'https://cdn.test/t.png' } })

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
