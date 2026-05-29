import { describe, it, expect, vi } from 'vitest'
import { render, screen }            from '@testing-library/react'
import userEvent                     from '@testing-library/user-event'
import { MessageComposerContainer }  from './MessageComposerContainer'

describe('MessageComposer', () => {
  it('send button is disabled when input is empty', () => {
    render(<MessageComposerContainer sendMessage={vi.fn()} isDisabled={false} />)

    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })

  it('send button is enabled after typing', async () => {
    const user = userEvent.setup()
    render(<MessageComposerContainer sendMessage={vi.fn()} isDisabled={false} />)

    await user.type(screen.getByRole('textbox'), 'Hello')

    expect(screen.getByRole('button', { name: /send/i })).toBeEnabled()
  })

  it('calls sendMessage and clears input on Enter', async () => {
    const sendMessage = vi.fn().mockResolvedValue(undefined)
    const user        = userEvent.setup()

    render(<MessageComposerContainer sendMessage={sendMessage} isDisabled={false} />)

    await user.type(screen.getByRole('textbox'), 'Hello{Enter}')

    expect(sendMessage).toHaveBeenCalledWith('Hello')
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('does not send on Shift+Enter', async () => {
    const sendMessage = vi.fn()
    const user        = userEvent.setup()

    render(<MessageComposerContainer sendMessage={sendMessage} isDisabled={false} />)

    await user.type(screen.getByRole('textbox'), 'Hello{Shift>}{Enter}{/Shift}')

    expect(sendMessage).not.toHaveBeenCalled()
  })
})
