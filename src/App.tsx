import { AuthProvider }  from '@/features/auth/context/AuthContext'
import { ToastProvider } from '@/features/app/Toast/context/ToastContext'
import { AppContainer }  from '@/features/app/AppContainer'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContainer />
      </AuthProvider>
    </ToastProvider>
  )
}
