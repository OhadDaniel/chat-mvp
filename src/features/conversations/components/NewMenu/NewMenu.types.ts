import type { ReactNode } from 'react'
import type { useNewMenu } from './hooks/useNewMenu'

export type NewMenuContextValue = ReturnType<typeof useNewMenu>

export type NewMenuItemModel = {
  key: string
  icon: ReactNode
  label: string
  onClick: () => void
}

export type NewMenuPanelProps = {
  items: NewMenuItemModel[]
}

export type NewMenuItemProps = {
  icon: ReactNode
  label: string
  onClick: () => void
}
