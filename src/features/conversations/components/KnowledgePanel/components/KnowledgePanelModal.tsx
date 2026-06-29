import { Modal } from '@/shared/components/Modal'
import { useKnowledgePanelContext } from '../KnowledgePanel.context'
import { UploadDocumentButtonContainer } from './UploadDocumentButtonContainer'
import { DocumentList } from './DocumentList'
import {
  KNOWLEDGE_TITLE,
  KNOWLEDGE_HINT,
  KNOWLEDGE_EMPTY_LABEL,
  KNOWLEDGE_LOADING_LABEL,
  KNOWLEDGE_BODY_CLASS,
  KNOWLEDGE_HINT_CLASS,
  KNOWLEDGE_STATE_CLASS,
} from '../KnowledgePanel.constants'

export function KnowledgePanelModal() {
  const { isOpen, close, documents, isLoading } = useKnowledgePanelContext()

  return isOpen ? (
    <Modal onClose={close} title={KNOWLEDGE_TITLE}>
      <div className={KNOWLEDGE_BODY_CLASS}>
        <p className={KNOWLEDGE_HINT_CLASS}>{KNOWLEDGE_HINT}</p>
        <UploadDocumentButtonContainer />
        {isLoading ? (
          <p className={KNOWLEDGE_STATE_CLASS}>{KNOWLEDGE_LOADING_LABEL}</p>
        ) : documents.length > 0 ? (
          <DocumentList documents={documents} />
        ) : (
          <p className={KNOWLEDGE_STATE_CLASS}>{KNOWLEDGE_EMPTY_LABEL}</p>
        )}
      </div>
    </Modal>
  ) : null
}
