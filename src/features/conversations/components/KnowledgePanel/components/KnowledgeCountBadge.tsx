import type { KnowledgeCountBadgeProps } from '../KnowledgePanel.types'
import { KNOWLEDGE_TRIGGER_COUNT_CLASS } from '../KnowledgePanel.constants'

export function KnowledgeCountBadge({ count }: KnowledgeCountBadgeProps) {
  return count > 0 ? <span className={KNOWLEDGE_TRIGGER_COUNT_CLASS}>{count}</span> : null
}
