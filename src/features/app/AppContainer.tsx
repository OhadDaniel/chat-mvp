import { useAuth }               from '@/features/auth/hooks/useAuth'
import { AuthScreensContainer }  from '@/features/auth/components/AuthScreens/AuthScreensContainer'
import { AppNavProvider }        from '@/features/app/context/AppNavContext'
import { AuthedApp }             from './AuthedApp/AuthedApp'

export function AppContainer() {
  const { user, isLoading } = useAuth()

  return (
    !isLoading &&
    (user ? (
      <AppNavProvider>
        <AuthedApp />
      </AppNavProvider>
    ) : (
      <AuthScreensContainer />
    ))
  )
}
