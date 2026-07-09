import type { AgentProgressProps } from './AgentProgress.types'
import {
  AGENT_PROGRESS_WRAPPER_CLASS,
  AGENT_PROGRESS_DOT_CLASS,
} from './AgentProgress.constants'

export function AgentProgress({ label }: AgentProgressProps) {
  return (
    <div className={AGENT_PROGRESS_WRAPPER_CLASS} role="status">
      <span className={AGENT_PROGRESS_DOT_CLASS} />
      <span>{label}</span>
    </div>
  )
}
