import { createContext, useContext, type ReactNode } from 'react'
import { useToast }                                  from '../hooks/useToast'
import { Toast }                                     from '../Toast'
import { TOAST_VISIBLE_CLASS, TOAST_HIDDEN_CLASS, TOAST_TEXT_CLASS } from '../Toast.constants'

type ToastContextValue = {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToastContext must be used inside <ToastProvider>')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const { message, isVisible, showToast } = useToast()

  const classNames = {
    wrapper: isVisible ? TOAST_VISIBLE_CLASS : TOAST_HIDDEN_CLASS,
    text:    TOAST_TEXT_CLASS,
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={message} classNames={classNames} />
    </ToastContext.Provider>
  )
}
