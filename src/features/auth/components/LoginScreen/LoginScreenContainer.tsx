import { LoginContext } from './LoginScreen.context'
import { useLoginScreen } from './hooks/useLoginScreen'
import { LoginScreen } from './LoginScreen'

export function LoginScreenContainer() {
  const contextValue = useLoginScreen()

  return (
    <LoginContext.Provider value={contextValue}>
      <LoginScreen />
    </LoginContext.Provider>
  )
}
