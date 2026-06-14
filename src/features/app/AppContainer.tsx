import { useAuth }                from '@/features/auth/hooks/useAuth'
import { AuthScreensContainer }  from '@/features/auth/components/AuthScreens/AuthScreensContainer'
import { AppLayoutContainer }    from './AppLayoutContainer'

export function AppContainer() {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  return user ? <AppLayoutContainer /> : <AuthScreensContainer />
}
