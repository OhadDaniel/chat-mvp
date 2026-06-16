import { ProfileContext } from './ProfileScreen.context'
import { useProfile }      from './hooks/useProfile'
import { ProfileScreen }   from './ProfileScreen'

export function ProfileScreenContainer() {
  const contextValue = useProfile()

  return (
    <ProfileContext.Provider value={contextValue}>
      <ProfileScreen />
    </ProfileContext.Provider>
  )
}
