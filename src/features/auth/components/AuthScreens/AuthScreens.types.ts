export type AuthScreensMode = 'login' | 'signup'

export type AuthScreensContextValue = {
  mode:           AuthScreensMode
  switchToLogin:  () => void
  switchToSignup: () => void
}
