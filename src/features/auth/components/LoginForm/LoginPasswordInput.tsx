import type { ChangeEvent }                             from 'react'
import { LOGIN_PASSWORD_PLACEHOLDER }                    from '@/features/auth/components/LoginScreen/LoginScreen.constants'
import { LOGIN_INPUT_CLASS }                             from './LoginForm.constants'

type Props = {
  value:    string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
}

export function LoginPasswordInput({ value, onChange, disabled }: Props) {
  return (
    <input
      type="password"
      placeholder={LOGIN_PASSWORD_PLACEHOLDER}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={LOGIN_INPUT_CLASS}
    />
  )
}
