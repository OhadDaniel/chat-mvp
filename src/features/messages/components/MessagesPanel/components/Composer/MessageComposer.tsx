import { useComposerContext } from './context/composer.context'
import { ComposerTextarea }  from './components/ComposerTextarea'
import { ComposerButton }    from './components/ComposerButton'

export function MessageComposer() {
  const { classNames } = useComposerContext()

  return (
    <div className={classNames.wrapper}>
      <ComposerTextarea />
      <ComposerButton />
    </div>
  )
}
