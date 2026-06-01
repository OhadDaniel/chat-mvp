import {
  SKELETON_COUNT,
  SKELETON_ROW_OWN_CLASS,
  SKELETON_ROW_OTHER_CLASS,
  SKELETON_BUBBLE_SHORT,
  SKELETON_BUBBLE_MEDIUM,
  SKELETON_BUBBLE_LONG,
} from './Skeleton.constants'
import { SkeletonRow } from './SkeletonRow'

const BUBBLE_WIDTHS = [SKELETON_BUBBLE_SHORT, SKELETON_BUBBLE_MEDIUM, SKELETON_BUBBLE_LONG]

export function SkeletonContainer() {
  const rows = Array.from({ length: SKELETON_COUNT }, (_, i) => {
    const rowClass    = i % 2 === 0 ? SKELETON_ROW_OWN_CLASS : SKELETON_ROW_OTHER_CLASS
    const bubbleWidth = BUBBLE_WIDTHS[i % BUBBLE_WIDTHS.length]

    return <SkeletonRow key={i} rowClass={rowClass} bubbleWidth={bubbleWidth} />
  })

  return <div>{rows}</div>
}
