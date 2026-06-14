export type AuthSubmitButtonProps = {
  label: string
  loadingLabel: string
  isLoading: boolean
  className: string
}

/** Presentational submit button. Shows loadingLabel + disables while isLoading. */
export function AuthSubmitButton({ label, loadingLabel, isLoading, className }: AuthSubmitButtonProps) {
  return (
    <button type="submit" disabled={isLoading} className={className}>
      {isLoading ? loadingLabel : label}
    </button>
  )
}
