import { useNewMenuContext } from '../NewMenu.context'
import { NewMenuTrigger } from './NewMenuTrigger'
import { NewMenuPanelContainer } from './NewMenuPanelContainer'
import { NEW_MENU_WRAPPER_CLASS } from '../NewMenu.constants'

export function NewMenuBar() {
  const { containerRef } = useNewMenuContext()

  return (
    <div ref={containerRef} className={NEW_MENU_WRAPPER_CLASS}>
      <NewMenuTrigger />
      <NewMenuPanelContainer />
    </div>
  )
}
