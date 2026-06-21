export type FormErrorProps = {
  error: string | null
  className: string
}


export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null
  return <p className={className}>{error}</p>
}
