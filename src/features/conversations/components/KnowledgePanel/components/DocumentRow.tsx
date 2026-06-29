import { RemoveDocumentButton } from './RemoveDocumentButton'
import type { DocumentRowProps } from '../KnowledgePanel.types'
import {
  KNOWLEDGE_CHUNKS_SUFFIX,
  KNOWLEDGE_ROW_CLASS,
  KNOWLEDGE_ROW_MAIN_CLASS,
  KNOWLEDGE_ROW_NAME_CLASS,
  KNOWLEDGE_ROW_META_CLASS,
} from '../KnowledgePanel.constants'

export function DocumentRow({ document, onRemove, busy }: DocumentRowProps) {
  return (
    <div className={KNOWLEDGE_ROW_CLASS}>
      <div className={KNOWLEDGE_ROW_MAIN_CLASS}>
        <p className={KNOWLEDGE_ROW_NAME_CLASS}>{document.source}</p>
        <p className={KNOWLEDGE_ROW_META_CLASS}>
          {document.chunkCount} {KNOWLEDGE_CHUNKS_SUFFIX}
        </p>
      </div>
      <RemoveDocumentButton onRemove={onRemove} busy={busy} />
    </div>
  )
}
