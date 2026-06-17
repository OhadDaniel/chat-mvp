import { EmailFormContext } from './EmailForm.context'
import { useEmailForm } from './hooks/useEmailForm'
import { EmailForm } from './EmailForm'

export function EmailFormContainer() {
  const value = useEmailForm()

  return (
    <EmailFormContext.Provider value={value}>
      <EmailForm />
    </EmailFormContext.Provider>
  )
}
