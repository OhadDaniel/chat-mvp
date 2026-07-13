import { DocumentGlyph } from '@/shared/components/DocumentGlyph'
import { KnowledgeCountBadge } from './KnowledgeCountBadge'
import type { KnowledgeTriggerProps } from '../KnowledgePanel.types'
import {
  KNOWLEDGE_OPEN_LABEL,
  KNOWLEDGE_TRIGGER_LABEL,
  KNOWLEDGE_TRIGGER_CLASS,
  KNOWLEDGE_TRIGGER_ICON_CLASS,
  KNOWLEDGE_TRIGGER_LABEL_CLASS,
} from '../KnowledgePanel.constants'

export function KnowledgeTrigger({ onOpen, count }: KnowledgeTriggerProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={KNOWLEDGE_OPEN_LABEL}
      className={KNOWLEDGE_TRIGGER_CLASS}
    >
      <DocumentGlyph className={KNOWLEDGE_TRIGGER_ICON_CLASS} />
      <span className={KNOWLEDGE_TRIGGER_LABEL_CLASS}>
        {KNOWLEDGE_TRIGGER_LABEL}
      </span>
      <KnowledgeCountBadge count={count} />
    </button>
  )
}
