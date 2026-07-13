import { DocumentRowContainer } from './DocumentRowContainer'
import type { DocumentListProps } from '../KnowledgePanel.types'
import { KNOWLEDGE_LIST_CLASS } from '../KnowledgePanel.constants'

export function DocumentList({ documents }: DocumentListProps) {
  return (
    <div className={KNOWLEDGE_LIST_CLASS}>
      {documents.map(document => (
        <DocumentRowContainer key={document.id} document={document} />
      ))}
    </div>
  )
}
