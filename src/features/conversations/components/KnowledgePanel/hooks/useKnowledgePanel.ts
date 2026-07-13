import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useToastContext } from '@/features/app/Toast/context/ToastContext'
import { knowledgeApi } from '@/api/knowledge.api'
import type { KnowledgeDocument } from '@/api/types'
import {
  KNOWLEDGE_ALLOWED_EXTENSIONS,
  KNOWLEDGE_MAX_BYTES,
  KNOWLEDGE_TOO_LARGE_TOAST,
  KNOWLEDGE_BAD_TYPE_TOAST,
  KNOWLEDGE_UPLOADED_TOAST,
  KNOWLEDGE_REMOVED_TOAST,
  KNOWLEDGE_ERROR_TOAST,
} from '../KnowledgePanel.constants'

export function useKnowledgePanel(tutorId: string) {
  const { showToast } = useToastContext()

  const [isOpen, setIsOpen] = useState(false)
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      const { documents } = await knowledgeApi.list(tutorId)
      setDocuments(documents)
    } catch {
      showToast(KNOWLEDGE_ERROR_TOAST)
    } finally {
      setIsLoading(false)
    }
  }, [tutorId, showToast])

  useEffect(() => {
    void load()
  }, [load])

  const open = (): void => setIsOpen(true)
  const close = (): void => setIsOpen(false)

  const upload = async (file: File): Promise<void> => {
    if (!KNOWLEDGE_ALLOWED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))) {
      showToast(KNOWLEDGE_BAD_TYPE_TOAST)
      return
    }
    if (file.size > KNOWLEDGE_MAX_BYTES) {
      showToast(KNOWLEDGE_TOO_LARGE_TOAST)
      return
    }
    setBusy(true)
    try {
      await knowledgeApi.upload(tutorId, file)
      await load()
      showToast(KNOWLEDGE_UPLOADED_TOAST)
    } catch {
      showToast(KNOWLEDGE_ERROR_TOAST)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (documentId: string): Promise<void> => {
    setBusy(true)
    try {
      await knowledgeApi.remove(documentId)
      setDocuments(docs => docs.filter(doc => doc.id !== documentId))
      showToast(KNOWLEDGE_REMOVED_TOAST)
    } catch {
      showToast(KNOWLEDGE_ERROR_TOAST)
    } finally {
      setBusy(false)
    }
  }

  const openFilePicker = (): void => {
    fileInputRef.current?.click()
  }

  const onFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) void upload(file)
    event.target.value = ''
  }

  const onRemove = (documentId: string): void => {
    void remove(documentId)
  }

  return {
    isOpen,
    open,
    close,
    documents,
    isLoading,
    busy,
    fileInputRef,
    openFilePicker,
    onFileChange,
    onRemove,
  }
}
