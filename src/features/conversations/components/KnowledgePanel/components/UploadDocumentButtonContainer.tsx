import { useKnowledgePanelContext } from '../KnowledgePanel.context'
import { UploadDocumentButton } from './UploadDocumentButton'

export function UploadDocumentButtonContainer() {
  const { fileInputRef, openFilePicker, onFileChange, busy } =
    useKnowledgePanelContext()

  return (
    <UploadDocumentButton
      fileInputRef={fileInputRef}
      onPick={openFilePicker}
      onFileChange={onFileChange}
      busy={busy}
    />
  )
}
