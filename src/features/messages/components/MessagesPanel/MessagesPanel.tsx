import { PANEL_WRAPPER_CLASS, PANEL_HEADER_CLASS, PANEL_CONTENT_CLASS } from './constants'
import type { MessagesPanelProps } from './types'

export function MessagesPanel({ title, children }: MessagesPanelProps) {
  return (
    <div className={PANEL_WRAPPER_CLASS}>
      <div className={PANEL_HEADER_CLASS}>{title}</div>
      <div className={PANEL_CONTENT_CLASS}>{children}</div>
    </div>
  )
}
