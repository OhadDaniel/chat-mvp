import { useNewTutorContext } from '../NewTutor.context'
import {
  NEW_TUTOR_CREATE_LABEL,
  NEW_TUTOR_CREATING_LABEL,
  NEW_TUTOR_FOOTER_CLASS,
  NEW_TUTOR_CREATE_CLASS,
} from '../NewTutor.constants'

export function NewTutorCreate() {
  const { canCreate, busy, create } = useNewTutorContext()

  return (
    <div className={NEW_TUTOR_FOOTER_CLASS}>
      <button
        type="button"
        disabled={!canCreate}
        onClick={() => void create()}
        className={NEW_TUTOR_CREATE_CLASS}
      >
        {busy ? NEW_TUTOR_CREATING_LABEL : NEW_TUTOR_CREATE_LABEL}
      </button>
    </div>
  )
}
