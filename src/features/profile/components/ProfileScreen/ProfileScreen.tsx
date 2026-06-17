import { useAppNavContext } from '@/features/app/context/AppNavContext'
import { AvatarSectionContainer } from './components/AvatarSection/AvatarSectionContainer'
import { NameFormContainer }      from './components/NameForm/NameFormContainer'
import { EmailFormContainer }     from './components/EmailForm/EmailFormContainer'
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
        <AvatarSectionContainer />
        <NameFormContainer />
        <EmailFormContainer />
      </div>
    </div>
  )
}
