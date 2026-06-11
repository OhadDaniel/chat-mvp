import { useAuthScreensContext }  from './AuthScreens.context'
import { LoginScreenContainer }   from '@/features/auth/components/LoginScreen/LoginScreenContainer'
import { SignupScreenContainer }  from '@/features/auth/components/SignupScreen/SignupScreenContainer'

export function AuthScreens() {
  const { mode } = useAuthScreensContext()

  return mode === 'login' ? <LoginScreenContainer /> : <SignupScreenContainer />
}
