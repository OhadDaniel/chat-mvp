import { useState }                       from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'

export function useMessageComposer(sendMessage: (content: string) => Promise<void>) {
  const [value, setValue] = useState('')

  function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
  }

  async function onSend() {
    const trimmed = value.trim()
    if (!trimmed) return
    setValue('')
    await sendMessage(trimmed)
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return { value, onChange, onKeyDown, onSend }
}
