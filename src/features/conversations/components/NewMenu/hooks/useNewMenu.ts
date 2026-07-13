import { useEffect, useRef, useState } from 'react'

export function useNewMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const open = (): void => setIsOpen(true)
  const close = (): void => setIsOpen(false)
  const toggle = (): void => setIsOpen(value => !value)

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: MouseEvent): void => {
      const target = event.target as Node
      if (containerRef.current && !containerRef.current.contains(target)) close()
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return { isOpen, open, close, toggle, containerRef }
}
