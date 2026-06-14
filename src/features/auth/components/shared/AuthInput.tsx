import type { ChangeEvent } from 'react'

export type AuthInputProps = {
  type: 'text' | 'email' | 'password'
  placeholder: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className: string
}

/** Presentational text/email/password field. Owns no state — the screen wires it. */
export function AuthInput({ type, placeholder, value, onChange, disabled, className }: AuthInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      disabled={disabled}
      className={className}
    />
  )
}
