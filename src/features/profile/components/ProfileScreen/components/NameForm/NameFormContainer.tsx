import { NameFormContext } from './NameForm.context'
import { useNameForm } from './hooks/useNameForm'
import { NameForm } from './NameForm'

export function NameFormContainer() {
  const value = useNameForm()

  return (
    <NameFormContext.Provider value={value}>
      <NameForm />
    </NameFormContext.Provider>
  )
}
