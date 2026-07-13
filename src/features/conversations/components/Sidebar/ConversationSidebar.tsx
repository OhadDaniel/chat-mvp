import { ConversationSearchContainer } from '../SearchBar/ConversationSearchContainer'
import { ConversationListContainer } from '../ConversationList/ConversationListContainer'
import { NewMenu } from '../NewMenu/NewMenu'
import { LogoutButton } from '@/features/auth/components/LogoutButton/LogoutButton'
import {
  SIDEBAR_CLASS,
  SIDEBAR_HEADER_CLASS,
  SIDEBAR_TITLE_CLASS,
  SIDEBAR_SUBTITLE_CLASS,
  SIDEBAR_ACTIONS_CLASS,
} from './ConversationSidebar.constants'

export function ConversationSidebar() {
  return (
    <div className={SIDEBAR_CLASS}>
      <div className={SIDEBAR_HEADER_CLASS}>
        <div>
          <h1 className={SIDEBAR_TITLE_CLASS}>fellowshipchat</h1>
          <p className={SIDEBAR_SUBTITLE_CLASS}>Messages</p>
        </div>
        <div className={SIDEBAR_ACTIONS_CLASS}>
          <NewMenu />
          <LogoutButton />
        </div>
      </div>
      <ConversationSearchContainer />
      <ConversationListContainer />
    </div>
  )
}
