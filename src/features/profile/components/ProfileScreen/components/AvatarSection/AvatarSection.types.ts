import type { useAvatar } from './hooks/useAvatar'

// Derived from the hook so the context value can never drift from what the
// hook actually returns (context.md).
export type AvatarContextValue = ReturnType<typeof useAvatar>
