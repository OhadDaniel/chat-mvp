export const PROFILE_SCREEN_CLASS = 'min-h-screen flex items-start justify-center bg-canvas py-12 px-4'
export const PROFILE_CARD_CLASS   = 'w-full max-w-md rounded-2xl border border-line-strong bg-panel p-8 shadow-2xl shadow-ink/5'

export const PROFILE_BACK_CLASS = 'mb-6 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent hover:text-accent-deep transition-colors'
export const PROFILE_BACK_LABEL = '← Back to chat'

export const PROFILE_TITLE       = 'Your profile'
export const PROFILE_TITLE_CLASS = 'text-2xl font-semibold text-ink tracking-tight'

export const PROFILE_INPUT_CLASS  = 'w-full rounded-xl border border-line-strong bg-white px-4 py-3 text-sm text-ink placeholder-faint focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-none disabled:opacity-50 transition-colors'
export const PROFILE_BUTTON_CLASS = 'mt-1 w-full rounded-lg bg-accent px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white hover:bg-accent-deep disabled:opacity-60 disabled:cursor-not-allowed transition-colors'
export const PROFILE_ERROR_CLASS  = 'text-xs text-red-500 font-medium'

export const PROFILE_FIRST_NAME_PLACEHOLDER = 'First name'
export const PROFILE_LAST_NAME_PLACEHOLDER  = 'Last name'
export const PROFILE_EMAIL_PLACEHOLDER      = 'Email'

export const PROFILE_NAME_SECTION_TITLE   = 'Name'
export const PROFILE_EMAIL_SECTION_TITLE  = 'Email'
export const PROFILE_AVATAR_SECTION_TITLE = 'Avatar'

export const PROFILE_NAME_SUBMIT_LABEL   = 'Save name'
export const PROFILE_NAME_LOADING_LABEL  = 'Saving…'
export const PROFILE_EMAIL_SUBMIT_LABEL  = 'Save email'
export const PROFILE_EMAIL_LOADING_LABEL = 'Saving…'

export const PROFILE_AVATAR_ACTIONS_CLASS = 'flex items-center gap-2'
export const PROFILE_AVATAR_ACCEPT        = 'image/png,image/jpeg,image/webp'
export const PROFILE_AVATAR_INPUT_CLASS   = 'hidden'

// Mirrors the backend's AVATAR_MAX_BYTES — checked client-side for fast feedback.
export const AVATAR_MAX_BYTES         = 5 * 1024 * 1024
export const PROFILE_AVATAR_TOO_LARGE = 'Image must be under 5 MB'

export const PROFILE_NAME_SAVED_TOAST     = 'Name updated'
export const PROFILE_EMAIL_SAVED_TOAST    = 'Email updated'
export const PROFILE_AVATAR_SAVED_TOAST   = 'Avatar updated'
export const PROFILE_AVATAR_REMOVED_TOAST = 'Avatar removed'

export const PROFILE_NAME_ERROR_API    = 'Could not update your name — please try again'
export const PROFILE_EMAIL_ERROR_TAKEN = 'That email is already in use'
export const PROFILE_EMAIL_ERROR_API   = 'Could not update your email — please try again'
export const PROFILE_AVATAR_ERROR_API  = 'Could not update your avatar — please try again'
