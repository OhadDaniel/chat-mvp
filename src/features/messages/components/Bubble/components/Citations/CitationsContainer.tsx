import { useState } from 'react'
import { Citations } from './Citations'
import type { CitationsContainerProps } from './Citations.types'

export function CitationsContainer({ citations }: CitationsContainerProps) {
  const [expanded, setExpanded] = useState(false)
  const toggle = (): void => setExpanded(value => !value)

  return <Citations citations={citations} expanded={expanded} onToggle={toggle} />
}
