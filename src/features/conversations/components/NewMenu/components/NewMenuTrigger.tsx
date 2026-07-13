import { useNewMenuContext } from '../NewMenu.context'
import {
  NEW_MENU_OPEN_LABEL,
  NEW_MENU_GLYPH,
  NEW_MENU_TRIGGER_CLASS,
  NEW_MENU_GLYPH_CLASS,
} from '../NewMenu.constants'

export function NewMenuTrigger() {
  const { toggle } = useNewMenuContext()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={NEW_MENU_OPEN_LABEL}
      className={NEW_MENU_TRIGGER_CLASS}
    >
      <span className={NEW_MENU_GLYPH_CLASS}>{NEW_MENU_GLYPH}</span>
    </button>
  )
}
