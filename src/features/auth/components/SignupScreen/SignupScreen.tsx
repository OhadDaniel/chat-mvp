import { AuthCard }    from '@/features/auth/components/shared/AuthCard'
import { SignupForm }  from './SignupForm/SignupForm'
import {
  SIGNUP_SCREEN_CLASS,
  SIGNUP_SCREEN_TITLE,
  SIGNUP_SCREEN_SUBTITLE,
} from './SignupScreen.constants'
import {
  SIGNUP_CARD_CLASS,
  SIGNUP_CARD_TITLE_CLASS,
  SIGNUP_CARD_SUBTITLE_CLASS,
  SIGNUP_CARD_BODY_CLASS,
} from './SignupCard/SignupCard.constants'

export function SignupScreen() {
  return (
    <div className={SIGNUP_SCREEN_CLASS}>
      <AuthCard
        title={SIGNUP_SCREEN_TITLE}
        subtitle={SIGNUP_SCREEN_SUBTITLE}
        className={SIGNUP_CARD_CLASS}
        titleClassName={SIGNUP_CARD_TITLE_CLASS}
        subtitleClassName={SIGNUP_CARD_SUBTITLE_CLASS}
        bodyClassName={SIGNUP_CARD_BODY_CLASS}
      >
        <SignupForm />
      </AuthCard>
    </div>
  )
}
