export type AuthErrorMessageProps = {
  error: string | null
  className: string
}

/** Renders nothing when there is no error. */
export function AuthErrorMessage({ error, className }: AuthErrorMessageProps) {
  if (!error) return null
  return <p className={className}>{error}</p>
}
