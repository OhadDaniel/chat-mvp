import { LoginProvider }    from './context/LoginScreen.context'
import { useLoginScreen }   from './hooks/useLoginScreen'
import { LoginScreen }      from './LoginScreen'

export function LoginScreenContainer() {
  const contextValue = useLoginScreen()

  return (
    <LoginProvider value={contextValue}>
      <LoginScreen />
    </LoginProvider>
  )
}
