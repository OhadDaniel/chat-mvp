import { useAuth }                from '@/features/auth/hooks/useAuth'
import { LoginScreenContainer }  from '@/features/auth/components/LoginScreen/LoginScreenContainer'
import { AppLayoutContainer }    from './AppLayoutContainer'

export function AppContainer() {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  return user ? <AppLayoutContainer /> : <LoginScreenContainer />
}
