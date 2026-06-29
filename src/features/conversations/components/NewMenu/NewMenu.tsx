import { NewMenuProvider } from './NewMenu.context'
import { NewDirectMessageProvider } from './components/NewDirectMessage/NewDirectMessage.context'
import { NewDirectMessagePanel } from './components/NewDirectMessage/components/NewDirectMessagePanel'
import { NewGroupProvider } from './components/NewGroup/NewGroup.context'
import { NewGroupPanel } from './components/NewGroup/components/NewGroupPanel'
import { NewTutorProvider } from './components/NewTutor/NewTutor.context'
import { NewTutorPanel } from './components/NewTutor/components/NewTutorPanel'
import { NewMenuBar } from './components/NewMenuBar'

export function NewMenu() {
  return (
    <NewMenuProvider>
      <NewDirectMessageProvider>
        <NewGroupProvider>
          <NewTutorProvider>
            <NewMenuBar />
            <NewDirectMessagePanel />
            <NewGroupPanel />
            <NewTutorPanel />
          </NewTutorProvider>
        </NewGroupProvider>
      </NewDirectMessageProvider>
    </NewMenuProvider>
  )
}
