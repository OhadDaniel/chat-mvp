import { ConversationSearchContainer }  from '../SearchBar/ConversationSearchContainer'
import { ConversationListContainer }    from '../ConversationList/ConversationListContainer'
import { SIDEBAR_CLASS }                from './ConversationSidebar.constants'
import type { ConversationSidebarProps } from './ConversationSidebar.types'

const HEADER_CLASS  = 'px-5 py-5 border-b border-slate-700/50 flex items-start justify-between'
const LOGOUT_CLASS  = 'text-xs text-slate-500 hover:text-slate-300 transition-colors mt-1 cursor-pointer'

export function ConversationSidebar({ onLogout }: ConversationSidebarProps) {
  return (
    <div className={SIDEBAR_CLASS}>
      <div className={HEADER_CLASS}>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">FellowshipChat</h1>
          <p className="text-xs text-slate-500 mt-0.5">Messages</p>
        </div>
        <button onClick={onLogout} className={LOGOUT_CLASS}>
          Sign out
        </button>
      </div>
      <ConversationSearchContainer />
      <ConversationListContainer />
    </div>
  )
}
