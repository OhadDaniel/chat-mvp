import type { ReactNode } from 'react'
import { APP_LAYOUT_CLASS } from './AppLayout.constants'

type Props = {
  sidebarNode: ReactNode
  panelNode:   ReactNode
}

export function AppLayout({ sidebarNode, panelNode }: Props) {
  return (
    <div className={APP_LAYOUT_CLASS}>
      {sidebarNode}
      {panelNode}
    </div>
  )
}
