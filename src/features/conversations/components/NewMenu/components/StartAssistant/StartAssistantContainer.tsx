import { useStartAssistant } from './hooks/useStartAssistant'
import { StartAssistant } from './StartAssistant'

export function StartAssistantContainer() {
  const { start, busy } = useStartAssistant()
  return <StartAssistant onClick={start} disabled={busy} />
}
