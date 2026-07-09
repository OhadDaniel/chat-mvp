import { createContext, useContext }        from 'react'
import type { ReactNode }                  from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'

export type ComposerContextValue = {
  value:      string
  isDisabled: boolean
  onChange:   (e: ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown:  (e: KeyboardEvent<HTMLTextAreaElement>) => void
  onSend:     () => void
  classNames: {
    wrapper:  string
    textarea: string
    button:   string
  }
}

const ComposerContext = createContext<ComposerContextValue | null>(null)

export function useComposerContext(): ComposerContextValue {
  const ctx = useContext(ComposerContext)
  if (!ctx) throw new Error('useComposerContext must be used inside <ComposerProvider>')
  return ctx
}

type Props = {
  value:    ComposerContextValue
  children: ReactNode
}

export function ComposerProvider({ value, children }: Props) {
  return (
    <ComposerContext.Provider value={value}>
      {children}
    </ComposerContext.Provider>
  )
}
