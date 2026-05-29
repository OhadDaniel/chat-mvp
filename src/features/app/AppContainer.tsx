import { useAuth }                from '@/features/auth/hooks/useAuth'
import { LoginScreenContainer }  from '@/features/auth/components/LoginScreen/LoginScreenContainer'
import { AppLayoutContainer }    from './AppLayoutContainer'

export function AppContainer() {
  const { user } = useAuth()

  return user ? <AppLayoutContainer /> : <LoginScreenContainer />
}
