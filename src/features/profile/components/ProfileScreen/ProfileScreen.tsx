import { useAppNavContext } from '@/features/app/context/AppNavContext'
import { AvatarSection }    from './components/AvatarSection/AvatarSection'
import { NameForm }         from './components/NameForm/NameForm'
import { EmailForm }        from './components/EmailForm/EmailForm'
import {
  PROFILE_SCREEN_CLASS,
  PROFILE_CARD_CLASS,
  PROFILE_BACK_CLASS,
  PROFILE_BACK_LABEL,
  PROFILE_TITLE,
  PROFILE_TITLE_CLASS,
} from './ProfileScreen.constants'

export function ProfileScreen() {
  const { goToChat } = useAppNavContext()

  return (
    <div className={PROFILE_SCREEN_CLASS}>
      <div className={PROFILE_CARD_CLASS}>
        <button type="button" onClick={goToChat} className={PROFILE_BACK_CLASS}>
          {PROFILE_BACK_LABEL}
        </button>
        <h1 className={PROFILE_TITLE_CLASS}>{PROFILE_TITLE}</h1>
        <AvatarSection />
        <NameForm />
        <EmailForm />
      </div>
    </div>
  )
}
