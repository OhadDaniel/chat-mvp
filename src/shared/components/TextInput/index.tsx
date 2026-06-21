import type { ChangeEvent } from 'react'

export type TextInputProps = {
  type: 'text' | 'email' | 'password'
  placeholder: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className: string
}

export function TextInput({ type, placeholder, value, onChange, disabled, className }: TextInputProps) {
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
