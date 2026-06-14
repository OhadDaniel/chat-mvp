import { AuthCard }   from '@/features/auth/components/shared/AuthCard'
import { LoginForm }  from './LoginForm/LoginForm'
import {
  LOGIN_SCREEN_CLASS,
  LOGIN_SCREEN_TITLE,
  LOGIN_SCREEN_SUBTITLE,
} from './LoginScreen.constants'
import {
  LOGIN_CARD_CLASS,
  LOGIN_CARD_TITLE_CLASS,
  LOGIN_CARD_SUBTITLE_CLASS,
  LOGIN_CARD_BODY_CLASS,
} from './LoginCard/LoginCard.constants'

export function LoginScreen() {
  return (
    <div className={LOGIN_SCREEN_CLASS}>
      <AuthCard
        title={LOGIN_SCREEN_TITLE}
        subtitle={LOGIN_SCREEN_SUBTITLE}
        className={LOGIN_CARD_CLASS}
        titleClassName={LOGIN_CARD_TITLE_CLASS}
        subtitleClassName={LOGIN_CARD_SUBTITLE_CLASS}
        bodyClassName={LOGIN_CARD_BODY_CLASS}
      >
        <LoginForm />
      </AuthCard>
    </div>
  )
}
