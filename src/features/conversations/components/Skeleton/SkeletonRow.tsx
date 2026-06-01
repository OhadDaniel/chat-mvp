import { SKELETON_ROW_CLASS, SKELETON_AVATAR_CLASS, SKELETON_BODY_CLASS, SKELETON_LINE_TOP, SKELETON_LINE_BOTTOM } from './ConversationSkeleton.constants'

export function SkeletonRow() {
  return (
    <div className={SKELETON_ROW_CLASS}>
      <div className={SKELETON_AVATAR_CLASS} />
      <div className={SKELETON_BODY_CLASS}>
        <div className={SKELETON_LINE_TOP} />
        <div className={SKELETON_LINE_BOTTOM} />
      </div>
    </div>
  )
}
