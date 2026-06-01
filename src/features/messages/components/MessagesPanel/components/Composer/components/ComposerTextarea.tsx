import { useComposerContext }                  from '../context/composer.context'
import { COMPOSER_PLACEHOLDER, COMPOSER_ROWS } from '../constants/MessageComposer.constants'

export function ComposerTextarea() {
  const { value, isDisabled, onChange, onKeyDown, classNames } = useComposerContext()

  return (
    <textarea
      className={classNames.textarea}
      value={value}
      rows={COMPOSER_ROWS}
      placeholder={COMPOSER_PLACEHOLDER}
      disabled={isDisabled}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  )
}
