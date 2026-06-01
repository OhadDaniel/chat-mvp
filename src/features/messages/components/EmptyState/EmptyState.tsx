const EMPTY_STATE_CLASS = 'flex flex-col items-center justify-center h-full text-sm text-gray-400 gap-2 select-none'

type Props = {
  message: string
}

export function EmptyState({ message }: Props) {
  return (
    <div className={EMPTY_STATE_CLASS}>
      {message}
    </div>
  )
}
