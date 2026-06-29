import { Modal } from '@/shared/components/Modal'
import { useNewGroupContext } from '../NewGroup.context'
import { NewGroupName } from './NewGroupName'
import { NewGroupSearch } from './NewGroupSearch'
import { NewGroupPeople } from './NewGroupPeople'
import { NewGroupCreate } from './NewGroupCreate'
import { NEW_GROUP_TITLE } from '../NewGroup.constants'

export function NewGroupPanel() {
  const { isOpen, close } = useNewGroupContext()

  return (
    isOpen && (
      <Modal onClose={close} title={NEW_GROUP_TITLE}>
        <div className="space-y-2 p-3">
          <NewGroupName />
          <NewGroupSearch />
        </div>
        <NewGroupPeople />
        <NewGroupCreate />
      </Modal>
    )
  )
}
