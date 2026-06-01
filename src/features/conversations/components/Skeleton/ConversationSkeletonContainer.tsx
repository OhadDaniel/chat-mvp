import { ConversationSkeleton } from './ConversationSkeleton'
import { SkeletonRow }          from './SkeletonRow'

const SKELETON_COUNT = 3

export function ConversationSkeletonContainer() {
  const rows = Array.from({ length: SKELETON_COUNT }, (_, i) => <SkeletonRow key={i} />)
  return <ConversationSkeleton>{rows}</ConversationSkeleton>
}
