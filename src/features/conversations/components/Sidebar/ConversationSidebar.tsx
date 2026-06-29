import { ConversationSearchContainer } from '../SearchBar/ConversationSearchContainer'
import { ConversationListContainer }   from '../ConversationList/ConversationListContainer'
import { StartAssistantContainer }     from '../StartAssistant/StartAssistantContainer'
import { NewDirectMessageProvider }    from '../NewDirectMessage/NewDirectMessage.context'
import { NewDirectMessage }            from '../NewDirectMessage/NewDirectMessage'
import { NewGroupProvider }            from '../NewGroup/NewGroup.context'
import { NewGroup }                    from '../NewGroup/NewGroup'
import { LogoutButton }                from '@/features/auth/components/LogoutButton/LogoutButton'
import { SIDEBAR_CLASS }               from './ConversationSidebar.constants'

export function ConversationSidebar() {
  return (
    <div className={SIDEBAR_CLASS}>
      <div className="px-5 py-5 border-b border-line-strong flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg className="w-5 h-5 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <path d="M12 4v16M4 12h16" />
          </svg>
          <div>
            <h1 className="text-[17px] font-semibold text-ink tracking-tight">fellowshipchat</h1>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-faint mt-0.5">Messages</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <StartAssistantContainer />
          <NewDirectMessageProvider>
            <NewDirectMessage />
          </NewDirectMessageProvider>
          <NewGroupProvider>
            <NewGroup />
          </NewGroupProvider>
          <LogoutButton />
        </div>
      </div>
      <ConversationSearchContainer />
      <ConversationListContainer />
    </div>
  )
}
