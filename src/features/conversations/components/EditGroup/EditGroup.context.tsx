import { createContext, useContext, type ReactNode } from 'react'
import { useEditGroup } from './hooks/useEditGroup'
import type { GroupConversation } from '@/features/conversations/types'
import type { EditGroupContextValue } from './EditGroup.types'

export const EditGroupContext = createContext<EditGroupContextValue | null>(null)

export function useEditGroupContext(): EditGroupContextValue {
  const ctx = useContext(EditGroupContext)
  if (!ctx) throw new Error('useEditGroupContext must be used inside <EditGroupProvider>')
  return ctx
}

export function EditGroupProvider({ group, children }: { group: GroupConversation; children: ReactNode }) {
  const value = useEditGroup(group)

  return (
    <EditGroupContext.Provider value={value}>
      {children}
    </EditGroupContext.Provider>
  )
}
