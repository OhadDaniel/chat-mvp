import { useEditTutorContext } from '../EditTutor.context'
import { EditTutorTrigger } from './EditTutorTrigger'

export function EditTutorTriggerContainer() {
  const { open } = useEditTutorContext()

  return <EditTutorTrigger onOpen={open} />
}
