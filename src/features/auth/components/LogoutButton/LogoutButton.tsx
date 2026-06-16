import { useAuth }            from '@/features/auth/hooks/useAuth'
import { useAppNavContext }    from '@/features/app/context/AppNavContext'
import { UserAvatar }          from '@/features/user/components/UserAvatar/UserAvatar'
import { LOGOUT_BUTTON_CLASS, LOGOUT_BUTTON_LABEL, LOGOUT_ROW_CLASS, LOGOUT_AVATAR_BUTTON_CLASS } from './LogoutButton.constants'

export function LogoutButton() {
  const { user, logout }   = useAuth()
  const { goToProfile }    = useAppNavContext()

  if (!user) return null

  return (
    <div className={LOGOUT_ROW_CLASS}>
      <button type="button" onClick={goToProfile} className={LOGOUT_AVATAR_BUTTON_CLASS}>
        <UserAvatar initials={user.avatarInitials} name={user.name} avatarUrl={user.avatarUrl} size="sm" />
      </button>
      <button type="button" onClick={logout} className={LOGOUT_BUTTON_CLASS}>
        {LOGOUT_BUTTON_LABEL}
      </button>
    </div>
  )
}
