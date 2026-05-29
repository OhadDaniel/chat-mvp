const TIME_CLASS = 'text-xs text-slate-500'

type Props = { time: string }

export function Time({ time }: Props) {
  return <span className={TIME_CLASS}>{time}</span>
}
