import type { useNameForm } from './hooks/useNameForm'

// Derived from the hook so it can't drift from what the hook returns (context.md).
export type NameFormContextValue = ReturnType<typeof useNameForm>
