import type { ChangeEvent, RefObject } from 'react'
import type { useKnowledgePanel } from './hooks/useKnowledgePanel'
import type { KnowledgeDocument } from '@/api/types'

export type KnowledgePanelContextValue = ReturnType<typeof useKnowledgePanel>

export type KnowledgeTriggerProps = {
  onOpen: () => void
  count:  number
}

export type UploadDocumentButtonProps = {
  fileInputRef: RefObject<HTMLInputElement | null>
  onPick:       () => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  busy:         boolean
}

export type DocumentListProps = {
  documents: KnowledgeDocument[]
}

export type DocumentRowContainerProps = {
  document: KnowledgeDocument
}

export type DocumentRowProps = {
  document: KnowledgeDocument
  onRemove: () => void
  busy:     boolean
}

export type RemoveDocumentButtonProps = {
  onRemove: () => void
  busy:     boolean
}

export type KnowledgeCountBadgeProps = {
  count: number
}
