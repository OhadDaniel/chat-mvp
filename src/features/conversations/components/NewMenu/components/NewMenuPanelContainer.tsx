import { ChatGlyph } from '@/shared/components/ChatGlyph'
import { UsersGlyph } from '@/shared/components/UsersGlyph'
import { SparkleGlyph } from '@/shared/components/SparkleGlyph'
import { AcademicCapGlyph } from '@/shared/components/AcademicCapGlyph'
import { useNewMenuContext } from '../NewMenu.context'
import { useNewDirectMessageContext } from './NewDirectMessage/NewDirectMessage.context'
import { useNewGroupContext } from './NewGroup/NewGroup.context'
import { useNewTutorContext } from './NewTutor/NewTutor.context'
import { useStartAssistant } from './StartAssistant/hooks/useStartAssistant'
import { NewMenuPanel } from './NewMenuPanel'
import type { NewMenuItemModel } from '../NewMenu.types'
import {
  NEW_MENU_DM_LABEL,
  NEW_MENU_GROUP_LABEL,
  NEW_MENU_ASSISTANT_LABEL,
  NEW_MENU_TUTOR_LABEL,
  NEW_MENU_ICON_CLASS,
} from '../NewMenu.constants'

export function NewMenuPanelContainer() {
  const { isOpen, close } = useNewMenuContext()
  const directMessage = useNewDirectMessageContext()
  const group = useNewGroupContext()
  const tutor = useNewTutorContext()
  const { start } = useStartAssistant()

  const items: NewMenuItemModel[] = [
    {
      key: 'direct',
      icon: <ChatGlyph className={NEW_MENU_ICON_CLASS} />,
      label: NEW_MENU_DM_LABEL,
      onClick: () => {
        directMessage.open()
        close()
      },
    },
    {
      key: 'group',
      icon: <UsersGlyph className={NEW_MENU_ICON_CLASS} />,
      label: NEW_MENU_GROUP_LABEL,
      onClick: () => {
        group.open()
        close()
      },
    },
    {
      key: 'assistant',
      icon: <SparkleGlyph className={NEW_MENU_ICON_CLASS} />,
      label: NEW_MENU_ASSISTANT_LABEL,
      onClick: () => {
        void start()
        close()
      },
    },
    {
      key: 'tutor',
      icon: <AcademicCapGlyph className={NEW_MENU_ICON_CLASS} />,
      label: NEW_MENU_TUTOR_LABEL,
      onClick: () => {
        tutor.open()
        close()
      },
    },
  ]

  return isOpen ? <NewMenuPanel items={items} /> : null
}
