const ROW_BASE_CLASS =
  'flex w-full items-center gap-3 px-4 py-2.5 text-left disabled:opacity-50 transition-colors'
const ROW_SELECTED_CLASS = 'bg-accent-tint'
const ROW_IDLE_CLASS = 'hover:bg-white'

export function getPersonRowClass(isSelected: boolean): string {
  return `${ROW_BASE_CLASS} ${isSelected ? ROW_SELECTED_CLASS : ROW_IDLE_CLASS}`
}

export function getPersonCheckGlyph(isSelected: boolean): string {
  return isSelected ? '✓' : ''
}
