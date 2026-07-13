import { createContext, useContext, type ReactNode } from 'react'
import { useKnowledgePanel } from './hooks/useKnowledgePanel'
import type { KnowledgePanelContextValue } from './KnowledgePanel.types'

export const KnowledgePanelContext =
  createContext<KnowledgePanelContextValue | null>(null)

export function useKnowledgePanelContext(): KnowledgePanelContextValue {
  const ctx = useContext(KnowledgePanelContext)
  if (!ctx) throw new Error('useKnowledgePanelContext must be used inside <KnowledgePanelProvider>')
  return ctx
}

export function KnowledgePanelProvider({
  tutorId,
  children,
}: {
  tutorId: string
  children: ReactNode
}) {
  const value = useKnowledgePanel(tutorId)

  return (
    <KnowledgePanelContext.Provider value={value}>
      {children}
    </KnowledgePanelContext.Provider>
  )
}
