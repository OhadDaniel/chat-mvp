import { NewMenuItem } from './NewMenuItem'
import type { NewMenuPanelProps } from '../NewMenu.types'
import { NEW_MENU_PANEL_CLASS } from '../NewMenu.constants'

export function NewMenuPanel({ items }: NewMenuPanelProps) {
  return (
    <div className={NEW_MENU_PANEL_CLASS}>
      {items.map(item => (
        <NewMenuItem
          key={item.key}
          icon={item.icon}
          label={item.label}
          onClick={item.onClick}
        />
      ))}
    </div>
  )
}
