import { SignupContext } from './SignupScreen.context'
import { useSignupScreen } from './hooks/useSignupScreen'
import { SignupScreen } from './SignupScreen'

export function SignupScreenContainer() {
  const contextValue = useSignupScreen()

  return (
    <SignupContext.Provider value={contextValue}>
      <SignupScreen />
    </SignupContext.Provider>
  )
}
