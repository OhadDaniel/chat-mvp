import { useKnowledgePanelContext } from '../KnowledgePanel.context'
import { DocumentRow } from './DocumentRow'
import type { DocumentRowContainerProps } from '../KnowledgePanel.types'

export function DocumentRowContainer({ document }: DocumentRowContainerProps) {
  const { onRemove, busy } = useKnowledgePanelContext()

  return (
    <DocumentRow
      document={document}
      onRemove={() => onRemove(document.id)}
      busy={busy}
    />
  )
}
