import { UsersGlyph } from '@/shared/components/UsersGlyph'
import { useNewGroupContext } from '../NewGroup.context'
import { NEW_GROUP_OPEN_LABEL, NEW_GROUP_TRIGGER_CLASS } from '../NewGroup.constants'

export function NewGroupTrigger() {
  const { open } = useNewGroupContext()

  return (
    <button
      type="button"
      onClick={open}
      aria-label={NEW_GROUP_OPEN_LABEL}
      className={NEW_GROUP_TRIGGER_CLASS}
    >
      <UsersGlyph className="w-[18px] h-[18px]" />
    </button>
  )
}
