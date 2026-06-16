export type SubmitButtonProps = {
  label: string
  loadingLabel: string
  isLoading: boolean
  className: string
}


export function SubmitButton({ label, loadingLabel, isLoading, className }: SubmitButtonProps) {
  return (
    <button type="submit" disabled={isLoading} className={className}>
      {isLoading ? loadingLabel : label}
    </button>
  )
}
