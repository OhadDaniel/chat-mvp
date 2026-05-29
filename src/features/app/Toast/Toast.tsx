import type { ToastProps } from './Toast.types'

export function Toast({ message,classNames }: ToastProps) {
  return (
    <div className={classNames.wrapper}>
      <span className={classNames.text}>{message}</span>
    </div>
  )
}
