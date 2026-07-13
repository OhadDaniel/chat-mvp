import type { ToolActivity } from '@/features/messages/types'

export type AgentProgressContainerProps = {
  toolActivity: ToolActivity | null
}

export type AgentProgressProps = {
  label: string
}
