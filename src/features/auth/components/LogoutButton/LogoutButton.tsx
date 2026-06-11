import { useAuth }    from '@/features/auth/hooks/useAuth'
import { UserAvatar } from '@/features/user/components/UserAvatar/UserAvatar'
import { LOGOUT_BUTTON_CLASS, LOGOUT_BUTTON_LABEL, LOGOUT_ROW_CLASS } from './LogoutButton.constants'

export function LogoutButton() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className={LOGOUT_ROW_CLASS}>
      <UserAvatar initials={user.avatarInitials} name={user.name} size="sm" />
      <button type="button" onClick={logout} className={LOGOUT_BUTTON_CLASS}>
        {LOGOUT_BUTTON_LABEL}
      </button>
    </div>
  )
}
