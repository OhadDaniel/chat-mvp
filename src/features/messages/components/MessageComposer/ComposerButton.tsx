import { COMPOSER_BUTTON_LABEL } from './MessageComposer.constants'

type Props = {
  className:  string
  isDisabled: boolean
  value:      string
  onSend:     () => void
}

export function ComposerButton({ className, isDisabled, value, onSend }: Props) {
  return (
    <button
      className={className}
      disabled={isDisabled || value.trim().length === 0}
      onClick={onSend}
    >
      <span className="inline-flex skew-x-12 items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
        {COMPOSER_BUTTON_LABEL}
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 17L17 7M9 7h8v8" />
        </svg>
      </span>
    </button>
  )
}
