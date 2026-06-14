import { useState, useEffect, useRef, useCallback } from 'react'
import { TOAST_DURATION_MS }           from '../Toast.constants'

type UseToastReturn = {
  message:   string
  isVisible: boolean
  showToast: (msg: string) => void
}

export function useToast(): UseToastReturn {
  const [message,   setMessage]   = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Stable identity: showToast is a dependency of useFetchMessages' effect,
  // so a fresh function each render would re-trigger message fetches.
  const showToast = useCallback((msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setMessage(msg)
    setIsVisible(true)
    timerRef.current = setTimeout(() => setIsVisible(false), TOAST_DURATION_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { message, isVisible, showToast }
}
