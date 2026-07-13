import { useNewGroupContext } from '../NewGroup.context'
import {
  NEW_GROUP_CREATE_LABEL,
  NEW_GROUP_CREATING_LABEL,
  NEW_GROUP_FOOTER_CLASS,
  NEW_GROUP_CREATE_CLASS,
} from '../NewGroup.constants'

export function NewGroupCreate() {
  const { canCreate, busy, create } = useNewGroupContext()

  return (
    <div className={NEW_GROUP_FOOTER_CLASS}>
      <button
        type="button"
        disabled={!canCreate}
        onClick={() => void create()}
        className={NEW_GROUP_CREATE_CLASS}
      >
        {busy ? NEW_GROUP_CREATING_LABEL : NEW_GROUP_CREATE_LABEL}
      </button>
    </div>
  )
}
