const DEFAULT_LIMIT = 30
const MAX_LIMIT = 50

type PaginationResult<T extends { id: string }> = {
  items: T[]
  nextCursor: string | null
}

export function paginate<T extends { id: string }>(
  all: T[],
  cursor?: string,
  limit?: number
): PaginationResult<T> {
  const pageSize = Math.min(limit ?? DEFAULT_LIMIT, MAX_LIMIT)

  const cursorIndex = cursor ? all.findIndex(item => item.id === cursor) : all.length
  const end = cursorIndex === -1 ? all.length : cursorIndex
  const start = Math.max(0, end - pageSize)

  return {
    items: all.slice(start, end),
    nextCursor: start > 0 ? all[start].id : null,
  }
}
