import { PANEL_WRAPPER_CLASS, PANEL_HEADER_CLASS, PANEL_CONTENT_CLASS } from './constants'
import type { MessagesPanelProps } from './types'

export function MessagesPanel({ contentNode, composerNode, title }: MessagesPanelProps) {
  return (
    <div className={PANEL_WRAPPER_CLASS}>
      <div className={PANEL_HEADER_CLASS}>{title}</div>
      <div className={PANEL_CONTENT_CLASS}>{contentNode}</div>
      {composerNode}
    </div>
  )
}
