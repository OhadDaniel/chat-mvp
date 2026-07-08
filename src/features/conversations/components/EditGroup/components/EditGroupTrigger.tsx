import { SettingsGlyph } from '@/shared/components/SettingsGlyph'
import { useEditGroupContext } from '../EditGroup.context'
import { EDIT_GROUP_OPEN_LABEL, EDIT_GROUP_TRIGGER_CLASS } from '../EditGroup.constants'

export function EditGroupTrigger() {
  const { open } = useEditGroupContext()

  return (
    <button
      type="button"
      onClick={open}
      aria-label={EDIT_GROUP_OPEN_LABEL}
      className={EDIT_GROUP_TRIGGER_CLASS}
    >
      <SettingsGlyph className="w-[18px] h-[18px]" />
    </button>
  )
}
