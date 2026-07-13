import { createContext, useContext, type ReactNode } from 'react'
import { useEditTutor } from './hooks/useEditTutor'
import type { TutorConversation } from '@/features/conversations/types'
import type { EditTutorContextValue } from './EditTutor.types'

export const EditTutorContext = createContext<EditTutorContextValue | null>(null)

export function useEditTutorContext(): EditTutorContextValue {
  const ctx = useContext(EditTutorContext)
  if (!ctx) throw new Error('useEditTutorContext must be used inside <EditTutorProvider>')
  return ctx
}

export function EditTutorProvider({ tutor, children }: { tutor: TutorConversation; children: ReactNode }) {
  const value = useEditTutor(tutor)

  return (
    <EditTutorContext.Provider value={value}>
      {children}
    </EditTutorContext.Provider>
  )
}
