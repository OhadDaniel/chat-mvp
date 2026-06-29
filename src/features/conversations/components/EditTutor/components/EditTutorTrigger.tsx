import { SettingsGlyph } from '@/shared/components/SettingsGlyph'
import type { EditTutorTriggerProps } from '../EditTutor.types'
import {
  EDIT_TUTOR_OPEN_LABEL,
  EDIT_TUTOR_TRIGGER_CLASS,
  EDIT_TUTOR_TRIGGER_ICON_CLASS,
} from '../EditTutor.constants'

export function EditTutorTrigger({ onOpen }: EditTutorTriggerProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={EDIT_TUTOR_OPEN_LABEL}
      className={EDIT_TUTOR_TRIGGER_CLASS}
    >
      <SettingsGlyph className={EDIT_TUTOR_TRIGGER_ICON_CLASS} />
    </button>
  )
}
