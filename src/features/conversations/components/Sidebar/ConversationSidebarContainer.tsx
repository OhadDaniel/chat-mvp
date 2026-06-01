import { useAuth }              from '@/features/auth/hooks/useAuth'
import { ConversationSidebar } from './ConversationSidebar'

export function ConversationSidebarContainer() {
  const { logout } = useAuth()
  return <ConversationSidebar onLogout={logout} />
}
