import { useComposerContext }    from '../context/composer.context'
import { COMPOSER_BUTTON_LABEL } from '../constants/MessageComposer.constants'

export function ComposerButton() {
  const { value, isDisabled, onSend, classNames } = useComposerContext()

  return (
    <button
      className={classNames.button}
      disabled={isDisabled || value.trim().length === 0}
      onClick={onSend}
    >
      {COMPOSER_BUTTON_LABEL}
    </button>
  )
}
