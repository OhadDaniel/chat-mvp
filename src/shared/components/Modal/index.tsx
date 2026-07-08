import type { ReactNode } from 'react'
import {
  MODAL_CLOSE_LABEL,
  MODAL_CLOSE_GLYPH,
  MODAL_OVERLAY_CLASS,
  MODAL_PANEL_CLASS,
  MODAL_HEADER_CLASS,
  MODAL_TITLE_CLASS,
  MODAL_CLOSE_CLASS,
} from './Modal.constants'

export type ModalProps = {
  onClose:  () => void
  title:    string
  children: ReactNode
}

export function Modal({ onClose, title, children }: ModalProps) {
  return (
    <div className={MODAL_OVERLAY_CLASS} onClick={onClose}>
      <div className={MODAL_PANEL_CLASS} onClick={e => e.stopPropagation()}>
        <div className={MODAL_HEADER_CLASS}>
          <span className={MODAL_TITLE_CLASS}>{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={MODAL_CLOSE_LABEL}
            className={MODAL_CLOSE_CLASS}
          >
            {MODAL_CLOSE_GLYPH}
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
