import { useEffect, useRef } from 'react'
import type { Message }      from '@/features/messages/types'

export function useMessageList(messages: Message[]) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    sentinelRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return { sentinelRef }
}
