import type { useEmailForm } from './hooks/useEmailForm'

// Derived from the hook so it can't drift from what the hook returns (context.md).
export type EmailFormContextValue = ReturnType<typeof useEmailForm>
