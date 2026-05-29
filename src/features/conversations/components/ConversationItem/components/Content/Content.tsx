import type { ContentProps }                                        from './Content.types'
import { CONTENT_WRAPPER_CLASS, CONTENT_NAME_CLASS, CONTENT_MESSAGE_CLASS } from './Content.constants'

export function Content({ name, lastMessage }: ContentProps) {
  return (
    <div className={CONTENT_WRAPPER_CLASS}>
      <span className={CONTENT_NAME_CLASS}>{name}</span>
      <span className={CONTENT_MESSAGE_CLASS}>{lastMessage}</span>
    </div>
  )
}
