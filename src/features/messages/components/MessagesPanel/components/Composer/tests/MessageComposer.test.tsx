import { describe, it, expect, vi } from 'vitest'
import { render, screen }           from '@testing-library/react'
import userEvent                    from '@testing-library/user-event'
import { useState }                 from 'react'
import { ComposerProvider }         from '../context/composer.context'
import { MessageComposer }          from '../MessageComposer'

const classNames = { wrapper: '', textarea: '', button: '' }

function TestComposer({ isDisabled = false, onSend = vi.fn() }) {
  const [value, setValue] = useState('')

  const onChange  = (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) { onSend(value); setValue('') }
    }
  }
  const onSendClick = () => { if (value.trim()) { onSend(value); setValue('') } }

  return (
    <ComposerProvider value={{ value, isDisabled, onChange, onKeyDown, onSend: onSendClick, classNames }}>
      <MessageComposer />
    </ComposerProvider>
  )
}

describe('MessageComposer', () => {
  it('send button is disabled when input is empty', () => {
    render(<TestComposer />)
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })

  it('send button is enabled after typing', async () => {
    const user = userEvent.setup()
    render(<TestComposer />)

    await user.type(screen.getByRole('textbox'), 'Hello')

    expect(screen.getByRole('button', { name: /send/i })).toBeEnabled()
  })

  it('clears input and calls onSend on Enter', async () => {
    const onSend = vi.fn()
    const user   = userEvent.setup()
    render(<TestComposer onSend={onSend} />)

    await user.type(screen.getByRole('textbox'), 'Hello{Enter}')

    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('does not clear input on Shift+Enter', async () => {
    const user = userEvent.setup()
    render(<TestComposer />)

    await user.type(screen.getByRole('textbox'), 'Hello{Shift>}{Enter}{/Shift}')

    expect(screen.getByRole('textbox')).toHaveValue('Hello\n')
  })
})
