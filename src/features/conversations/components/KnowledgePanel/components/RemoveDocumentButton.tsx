import { TrashGlyph } from '@/shared/components/TrashGlyph'
import type { RemoveDocumentButtonProps } from '../KnowledgePanel.types'
import {
  KNOWLEDGE_REMOVE_LABEL,
  KNOWLEDGE_ROW_REMOVE_CLASS,
  KNOWLEDGE_ROW_REMOVE_ICON_CLASS,
} from '../KnowledgePanel.constants'

export function RemoveDocumentButton({ onRemove, busy }: RemoveDocumentButtonProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      disabled={busy}
      aria-label={KNOWLEDGE_REMOVE_LABEL}
      className={KNOWLEDGE_ROW_REMOVE_CLASS}
    >
      <TrashGlyph className={KNOWLEDGE_ROW_REMOVE_ICON_CLASS} />
    </button>
  )
}
