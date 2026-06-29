import { Modal } from '@/shared/components/Modal'
import { useNewTutorContext } from '../NewTutor.context'
import { NewTutorName } from './NewTutorName'
import { NewTutorCreate } from './NewTutorCreate'
import { NEW_TUTOR_TITLE, NEW_TUTOR_FIELDS_CLASS } from '../NewTutor.constants'

export function NewTutorPanel() {
  const { isOpen, close } = useNewTutorContext()

  return isOpen ? (
    <Modal onClose={close} title={NEW_TUTOR_TITLE}>
      <div className={NEW_TUTOR_FIELDS_CLASS}>
        <NewTutorName />
      </div>
      <NewTutorCreate />
    </Modal>
  ) : null
}
