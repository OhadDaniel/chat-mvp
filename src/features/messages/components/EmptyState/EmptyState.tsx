const EMPTY_STATE_CLASS = 'flex flex-col items-center justify-center h-full font-mono text-[11px] uppercase tracking-[0.14em] text-faint gap-2 select-none'

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
