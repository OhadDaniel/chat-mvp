import { useKnowledgePanelContext } from '../KnowledgePanel.context'
import { KnowledgeTrigger } from './KnowledgeTrigger'

export function KnowledgeTriggerContainer() {
  const { open, documents } = useKnowledgePanelContext()

  return <KnowledgeTrigger onOpen={open} count={documents.length} />
}
