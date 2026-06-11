import { ConversationSearchContainer } from '../SearchBar/ConversationSearchContainer'
import { ConversationListContainer }   from '../ConversationList/ConversationListContainer'
import { LogoutButton }                from '@/features/auth/components/LogoutButton/LogoutButton'
import { SIDEBAR_CLASS }               from './ConversationSidebar.constants'

export function ConversationSidebar() {
  return (
    <div className={SIDEBAR_CLASS}>
      <div className="px-5 py-5 border-b border-slate-700/50 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">FellowshipChat</h1>
          <p className="text-xs text-slate-500 mt-0.5">Messages</p>
        </div>
        <LogoutButton />
      </div>
      <ConversationSearchContainer />
      <ConversationListContainer />
    </div>
  )
}
