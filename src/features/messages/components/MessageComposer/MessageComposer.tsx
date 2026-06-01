import type { MessageComposerProps } from './MessageComposer.types'
import { ComposerTextarea }          from './ComposerTextarea'
import { ComposerButton }            from './ComposerButton'

export function MessageComposer({ value, isDisabled, onChange, onKeyDown, onSend, classNames }: MessageComposerProps) {
  return (
    <div className={classNames.wrapper}>
      <ComposerTextarea
        value={value}
        className={classNames.textarea}
        isDisabled={isDisabled}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <ComposerButton
        value={value}
        className={classNames.button}
        isDisabled={isDisabled}
        onSend={onSend}
      />
    </div>
  )
}
