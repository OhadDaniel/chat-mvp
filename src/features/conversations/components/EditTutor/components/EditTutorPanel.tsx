import { Modal } from '@/shared/components/Modal'
import { useEditTutorContext } from '../EditTutor.context'
import { EditTutorNameContainer } from './EditTutorNameContainer'
import { EditTutorAvatarContainer } from './EditTutorAvatarContainer'
import { EDIT_TUTOR_TITLE, EDIT_TUTOR_BODY_CLASS } from '../EditTutor.constants'

export function EditTutorPanel() {
  const { isOpen, close } = useEditTutorContext()

  return isOpen ? (
    <Modal onClose={close} title={EDIT_TUTOR_TITLE}>
      <div className={EDIT_TUTOR_BODY_CLASS}>
        <EditTutorNameContainer />
        <EditTutorAvatarContainer />
      </div>
    </Modal>
  ) : null
}
