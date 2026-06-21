import { REMOVE_BUTTON_CLASS, REMOVE_BUTTON_LABEL } from './RemoveButton.constants'

type Props = {
  onClick:  () => void
  disabled: boolean
}

export function RemoveButton({ onClick, disabled }: Props) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={REMOVE_BUTTON_CLASS}>
      {REMOVE_BUTTON_LABEL}
    </button>
  )
}
