import { Modal } from '@/shared/components/Modal'
import { useNewDirectMessageContext } from '../NewDirectMessage.context'
import { NewDirectMessageSearch } from './NewDirectMessageSearch'
import { NewDirectMessagePeople } from './NewDirectMessagePeople'
import { NEW_DM_TITLE } from '../NewDirectMessage.constants'

export function NewDirectMessagePanel() {
  const { isOpen, close } = useNewDirectMessageContext()

  return (
    isOpen && (
      <Modal onClose={close} title={NEW_DM_TITLE}>
        <NewDirectMessageSearch />
        <NewDirectMessagePeople />
      </Modal>
    )
  )
}
