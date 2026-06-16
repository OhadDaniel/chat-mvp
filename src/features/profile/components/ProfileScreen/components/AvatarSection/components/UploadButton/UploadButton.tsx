import { UPLOAD_BUTTON_CLASS, UPLOAD_BUTTON_LABEL } from './UploadButton.constants'

type Props = {
  onClick:  () => void
  disabled: boolean
}

export function UploadButton({ onClick, disabled }: Props) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={UPLOAD_BUTTON_CLASS}>
      {UPLOAD_BUTTON_LABEL}
    </button>
  )
}
