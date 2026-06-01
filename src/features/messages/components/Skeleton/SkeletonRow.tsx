import { SKELETON_AVATAR_CLASS, SKELETON_BUBBLE_CLASS } from './Skeleton.constants'

type Props = {
  rowClass:    string
  bubbleWidth: string
}

export function SkeletonRow({ rowClass, bubbleWidth }: Props) {
  return (
    <div className={rowClass}>
      <div className={SKELETON_AVATAR_CLASS} />
      <div className={`${SKELETON_BUBBLE_CLASS} ${bubbleWidth}`} />
    </div>
  )
}
