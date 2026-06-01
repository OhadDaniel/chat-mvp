import { PIN_LABEL, PINNED_LABEL, PIN_BUTTON_ACTIVE_CLASS, PIN_BUTTON_IDLE_CLASS } from './PinButton.constants'

export function getPinButtonClass(isPinned: boolean): string {
  return isPinned ? PIN_BUTTON_ACTIVE_CLASS : PIN_BUTTON_IDLE_CLASS
}

export function getPinButtonLabel(isPinned: boolean): string {
  return isPinned ? PINNED_LABEL : PIN_LABEL
}

export function getPinButtonAriaLabel(isPinned: boolean): string {
  return isPinned ? 'Unpin conversation' : 'Pin conversation'
}
