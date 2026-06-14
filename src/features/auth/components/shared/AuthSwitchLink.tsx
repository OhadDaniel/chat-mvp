export type AuthSwitchLinkProps = {
  prompt: string
  action: string
  onSwitch: () => void
  className: string
  buttonClassName: string
}

/** "Don't have an account? Sign up" style toggle. onSwitch comes from the screens context. */
export function AuthSwitchLink({ prompt, action, onSwitch, className, buttonClassName }: AuthSwitchLinkProps) {
  return (
    <p className={className}>
      {prompt}{' '}
      <button type="button" onClick={onSwitch} className={buttonClassName}>
        {action}
      </button>
    </p>
  )
}
