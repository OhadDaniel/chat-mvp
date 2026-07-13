export type AcademicCapGlyphProps = {
  className?: string
}

export function AcademicCapGlyph({ className = 'w-5 h-5' }: AcademicCapGlyphProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5" />
    </svg>
  )
}
