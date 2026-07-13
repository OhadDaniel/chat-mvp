import type { NewMenuItemProps } from '../NewMenu.types'
import {
  NEW_MENU_ITEM_CLASS,
  NEW_MENU_ITEM_ICON_CLASS,
  NEW_MENU_ITEM_LABEL_CLASS,
} from '../NewMenu.constants'

export function NewMenuItem({ icon, label, onClick }: NewMenuItemProps) {
  return (
    <button type="button" onClick={onClick} className={NEW_MENU_ITEM_CLASS}>
      <span className={NEW_MENU_ITEM_ICON_CLASS}>{icon}</span>
      <span className={NEW_MENU_ITEM_LABEL_CLASS}>{label}</span>
    </button>
  )
}
