import { useAuth }                from '@/features/auth/hooks/useAuth'
import { AuthScreensContainer }  from '@/features/auth/components/AuthScreens/AuthScreensContainer'
import { AppNavProvider, useAppNavContext } from '@/features/app/context/AppNavContext'
import { ProfileScreenContainer } from '@/features/profile/components/ProfileScreen/ProfileScreenContainer'
import { AppLayoutContainer }    from './AppLayoutContainer'

function AuthedApp() {
  const { view } = useAppNavContext()
  return view === 'profile' ? <ProfileScreenContainer /> : <AppLayoutContainer />
}

export function AppContainer() {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (!user) return <AuthScreensContainer />

  return (
    <AppNavProvider>
      <AuthedApp />
    </AppNavProvider>
  )
}
