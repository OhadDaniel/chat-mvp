import { AuthScreensContext } from './AuthScreens.context'
import { useAuthScreens } from './hooks/useAuthScreens'
import { AuthScreens } from './AuthScreens'

export function AuthScreensContainer() {
  const contextValue = useAuthScreens()

  return (
    <AuthScreensContext.Provider value={contextValue}>
      <AuthScreens />
    </AuthScreensContext.Provider>
  )
}
