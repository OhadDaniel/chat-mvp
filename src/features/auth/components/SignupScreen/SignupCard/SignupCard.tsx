import type { SignupCardProps }                                                          from './SignupCard.types'
import { SIGNUP_SCREEN_TITLE, SIGNUP_SCREEN_SUBTITLE }                                   from '../SignupScreen.constants'
import { SIGNUP_CARD_CLASS, SIGNUP_CARD_TITLE_CLASS, SIGNUP_CARD_SUBTITLE_CLASS, SIGNUP_CARD_BODY_CLASS } from './SignupCard.constants'

export function SignupCard({ children }: SignupCardProps) {
  return (
    <div className={SIGNUP_CARD_CLASS}>
      <h1 className={SIGNUP_CARD_TITLE_CLASS}>{SIGNUP_SCREEN_TITLE}</h1>
      <p  className={SIGNUP_CARD_SUBTITLE_CLASS}>{SIGNUP_SCREEN_SUBTITLE}</p>
      <div className={SIGNUP_CARD_BODY_CLASS}>{children}</div>
    </div>
  )
}
