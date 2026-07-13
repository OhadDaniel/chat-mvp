import { useEditTutorContext } from '../EditTutor.context'
import { EditTutorName } from './EditTutorName'

export function EditTutorNameContainer() {
  const { name, setName, savingName, onSubmitName } = useEditTutorContext()

  return (
    <EditTutorName
      name={name}
      setName={setName}
      savingName={savingName}
      onSubmitName={onSubmitName}
    />
  )
}
