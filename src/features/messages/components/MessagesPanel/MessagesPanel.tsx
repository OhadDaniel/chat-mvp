import { PANEL_WRAPPER_CLASS, PANEL_HEADER_CLASS, PANEL_CONTENT_CLASS } from './constants'
import type { MessagesPanelProps } from './types'

export function MessagesPanel({ title, actions, children }: MessagesPanelProps) {
  return (
    <div className={PANEL_WRAPPER_CLASS}>
      <div className={PANEL_HEADER_CLASS}>
        <span>{title}</span>
        {actions}
      </div>
      <div className={PANEL_CONTENT_CLASS}>{children}</div>
    </div>
  )
}
