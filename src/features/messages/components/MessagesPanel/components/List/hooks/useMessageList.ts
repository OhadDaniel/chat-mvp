import { useEffect, useRef }   from 'react'
import { useMessagesContext }  from '@/features/messages/context/messages.context'
import type { Message }        from '@/features/messages/types'

export function useMessageList(): { sentinelRef: React.RefObject<HTMLDivElement | null>; messages: Message[] } {
  const { messages } = useMessagesContext()
  const sentinelRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    sentinelRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return { sentinelRef, messages }
}
