import { ConversationSearchContainer } from './components/SearchBar/ConversationSearchContainer'
import { ConversationListContainer }   from './components/List/ConversationListContainer'
import {
  SIDEBAR_CLASS,
  SIDEBAR_HEADER_CLASS,
  SIDEBAR_TITLE_CLASS,
  SIDEBAR_SUBTITLE_CLASS,
  SIDEBAR_TITLE,
  SIDEBAR_SUBTITLE,
}                                      from './ConversationSidebar.constants'

export function ConversationSidebar() {
  return (
    <div className={SIDEBAR_CLASS}>
      <div className={SIDEBAR_HEADER_CLASS}>
        <h1 className={SIDEBAR_TITLE_CLASS}>{SIDEBAR_TITLE}</h1>
        <p className={SIDEBAR_SUBTITLE_CLASS}>{SIDEBAR_SUBTITLE}</p>
      </div>
      <ConversationSearchContainer />
      <ConversationListContainer />
    </div>
  )
}
