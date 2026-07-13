import { AgentProgress } from './AgentProgress'
import { TOOL_LABELS, DEFAULT_TOOL_LABEL } from './AgentProgress.constants'
import type { AgentProgressContainerProps } from './AgentProgress.types'

export function AgentProgressContainer({ toolActivity }: AgentProgressContainerProps) {
  if (!toolActivity) return null
  const label = TOOL_LABELS[toolActivity.name] ?? DEFAULT_TOOL_LABEL
  return <AgentProgress label={label} />
}
