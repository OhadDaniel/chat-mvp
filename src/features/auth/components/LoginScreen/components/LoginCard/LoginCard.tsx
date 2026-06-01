import type { LoginCardProps }                                                           from './types/LoginCard.types'
import { LOGIN_SCREEN_TITLE, LOGIN_SCREEN_SUBTITLE }                                     from '../../constants/LoginScreen.constants'
import { LOGIN_CARD_CLASS, LOGIN_CARD_TITLE_CLASS, LOGIN_CARD_SUBTITLE_CLASS, LOGIN_CARD_BODY_CLASS } from './constants/LoginCard.constants'

export function LoginCard({ children }: LoginCardProps) {
  return (
    <div className={LOGIN_CARD_CLASS}>
      <h1 className={LOGIN_CARD_TITLE_CLASS}>{LOGIN_SCREEN_TITLE}</h1>
      <p  className={LOGIN_CARD_SUBTITLE_CLASS}>{LOGIN_SCREEN_SUBTITLE}</p>
      <div className={LOGIN_CARD_BODY_CLASS}>{children}</div>
    </div>
  )
}
