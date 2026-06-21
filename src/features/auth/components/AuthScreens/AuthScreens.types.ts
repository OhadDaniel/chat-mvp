import type { useAuthScreens } from './hooks/useAuthScreens'

export type AuthScreensMode = 'login' | 'signup'

// Derived from the hook so it can't drift from what the hook returns (context.md).
export type AuthScreensContextValue = ReturnType<typeof useAuthScreens>
