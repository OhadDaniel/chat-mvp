import { Modal } from '@/shared/components/Modal'
import { useEditGroupContext } from '../EditGroup.context'
import { EditGroupName } from './EditGroupName'
import { EditGroupAvatar } from './EditGroupAvatar'
import { EDIT_GROUP_TITLE, EDIT_GROUP_BODY_CLASS } from '../EditGroup.constants'

export function EditGroupPanel() {
  const { isOpen, close } = useEditGroupContext()

  return (
    isOpen && (
      <Modal onClose={close} title={EDIT_GROUP_TITLE}>
        <div className={EDIT_GROUP_BODY_CLASS}>
          <EditGroupName />
          <EditGroupAvatar />
        </div>
      </Modal>
    )
  )
}
