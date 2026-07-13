import type { UploadDocumentButtonProps } from '../KnowledgePanel.types'
import {
  KNOWLEDGE_FILE_ACCEPT,
  KNOWLEDGE_UPLOAD_LABEL,
  KNOWLEDGE_UPLOADING_LABEL,
  KNOWLEDGE_UPLOAD_CLASS,
} from '../KnowledgePanel.constants'

export function UploadDocumentButton({
  fileInputRef,
  onPick,
  onFileChange,
  busy,
}: UploadDocumentButtonProps) {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={KNOWLEDGE_FILE_ACCEPT}
        onChange={onFileChange}
        hidden
      />
      <button
        type="button"
        onClick={onPick}
        disabled={busy}
        className={KNOWLEDGE_UPLOAD_CLASS}
      >
        {busy ? KNOWLEDGE_UPLOADING_LABEL : KNOWLEDGE_UPLOAD_LABEL}
      </button>
    </>
  )
}
