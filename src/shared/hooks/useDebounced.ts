import { useEffect, useRef } from 'react'

/**
 * Debounce a *function call*: returns a function that delays invoking `fn`
 * until `delay` ms have passed since the last call. The latest `fn` and the
 * pending timer live in refs, so rapid calls across renders coalesce into one.
 */
export function useDebounced<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): (...args: Args) => void {
  const fnRef = useRef(fn)
  fnRef.current = fn

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  return (...args: Args) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => fnRef.current(...args), delay)
  }
}
