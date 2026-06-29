import type { CitationsProps } from './Citations.types'
import {
  CITATIONS_LABEL,
  CITATIONS_CARET_EXPANDED,
  CITATIONS_CARET_COLLAPSED,
  CITATIONS_WRAPPER_CLASS,
  CITATIONS_TOGGLE_CLASS,
  CITATIONS_LIST_CLASS,
  CITATIONS_ITEM_CLASS,
  CITATIONS_DOC_CLASS,
  CITATIONS_TEXT_CLASS,
} from './Citations.constants'

export function Citations({ citations, expanded, onToggle }: CitationsProps) {
  return (
    <div className={CITATIONS_WRAPPER_CLASS}>
      <button type="button" onClick={onToggle} className={CITATIONS_TOGGLE_CLASS}>
        <span>{expanded ? CITATIONS_CARET_EXPANDED : CITATIONS_CARET_COLLAPSED}</span>
        <span>
          {CITATIONS_LABEL} ({citations.length})
        </span>
      </button>
      {expanded ? (
        <div className={CITATIONS_LIST_CLASS}>
          {citations.map(citation => (
            <div key={citation.chunkId} className={CITATIONS_ITEM_CLASS}>
              <p className={CITATIONS_DOC_CLASS}>{citation.documentName}</p>
              <p className={CITATIONS_TEXT_CLASS}>{citation.text}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
