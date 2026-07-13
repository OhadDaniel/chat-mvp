export const KNOWLEDGE_MAX_BYTES = 1_000_000
export const KNOWLEDGE_ALLOWED_EXTENSIONS = ['.txt', '.md']
export const KNOWLEDGE_FILE_ACCEPT = '.txt,.md,text/plain,text/markdown'

export const KNOWLEDGE_OPEN_LABEL = 'Knowledge base'
export const KNOWLEDGE_TRIGGER_LABEL = 'Knowledge'
export const KNOWLEDGE_TITLE = 'Knowledge base'
export const KNOWLEDGE_CHUNKS_SUFFIX = 'chunks'
export const KNOWLEDGE_UPLOAD_LABEL = 'Upload document'
export const KNOWLEDGE_UPLOADING_LABEL = 'Uploading…'
export const KNOWLEDGE_HINT = 'Upload .txt or .md files (max 1 MB) — the tutor answers only from these.'
export const KNOWLEDGE_EMPTY_LABEL = 'No documents yet. Upload one to start teaching this tutor.'
export const KNOWLEDGE_LOADING_LABEL = 'Loading documents…'
export const KNOWLEDGE_REMOVE_LABEL = 'Delete document'

export const KNOWLEDGE_TOO_LARGE_TOAST = 'That file is too large — max 1 MB'
export const KNOWLEDGE_BAD_TYPE_TOAST = 'Only .txt and .md files are supported'
export const KNOWLEDGE_UPLOADED_TOAST = 'Document added to the knowledge base'
export const KNOWLEDGE_REMOVED_TOAST = 'Document removed'
export const KNOWLEDGE_ERROR_TOAST = 'Something went wrong — please try again'

export const KNOWLEDGE_TRIGGER_CLASS =
  'flex h-8 items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 text-muted hover:border-accent/40 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 transition-colors'
export const KNOWLEDGE_TRIGGER_ICON_CLASS = 'w-[15px] h-[15px]'
export const KNOWLEDGE_TRIGGER_LABEL_CLASS =
  'font-mono text-[10px] font-bold uppercase tracking-[0.16em]'
export const KNOWLEDGE_TRIGGER_COUNT_CLASS =
  'flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white'

export const KNOWLEDGE_BODY_CLASS = 'space-y-3 p-4'
export const KNOWLEDGE_HINT_CLASS = 'text-[12px] leading-relaxed text-muted'
export const KNOWLEDGE_UPLOAD_CLASS =
  'w-full rounded-lg bg-accent px-3 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white hover:bg-accent-deep disabled:opacity-50 transition-colors'
export const KNOWLEDGE_STATE_CLASS =
  'px-1 py-4 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-faint'
export const KNOWLEDGE_LIST_CLASS = 'max-h-64 space-y-1.5 overflow-y-auto'
export const KNOWLEDGE_ROW_CLASS =
  'flex items-center gap-3 rounded-lg border border-line bg-white px-3 py-2'
export const KNOWLEDGE_ROW_NAME_CLASS = 'truncate text-sm text-ink'
export const KNOWLEDGE_ROW_META_CLASS =
  'font-mono text-[10px] uppercase tracking-[0.14em] text-faint'
export const KNOWLEDGE_ROW_MAIN_CLASS = 'min-w-0 flex-1'
export const KNOWLEDGE_ROW_REMOVE_CLASS =
  'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line text-muted hover:border-red-300 hover:text-red-500 disabled:opacity-50 transition-colors'
export const KNOWLEDGE_ROW_REMOVE_ICON_CLASS = 'w-[14px] h-[14px]'
