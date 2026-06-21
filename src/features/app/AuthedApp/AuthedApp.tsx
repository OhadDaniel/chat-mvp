import { useAppNavContext } from '@/features/app/context/AppNavContext'
import { ProfileScreen } from '@/features/profile/components/ProfileScreen/ProfileScreen'
import { AppLayoutContainer } from '@/features/app/AppLayoutContainer'

export function AuthedApp() {
  const { view } = useAppNavContext()
  return view === 'profile' ? <ProfileScreen /> : <AppLayoutContainer />
}
