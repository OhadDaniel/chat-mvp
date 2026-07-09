import { describe, it, expect } from 'vitest'
import { paginate } from './paginate'

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ id: `msg-${i + 1}` }))

describe('paginate', () => {
  it('returns the last N items when no cursor is given', () => {
    const items = makeItems(10)
    const result = paginate(items, undefined, 3)
    expect(result.items).toHaveLength(3)
    expect(result.items[0].id).toBe('msg-8')
    expect(result.items[2].id).toBe('msg-10')
  })

  it('returns nextCursor when there are more items before the page', () => {
    const items = makeItems(10)
    const result = paginate(items, undefined, 3)
    expect(result.nextCursor).toBe('msg-8')
  })

  it('returns nextCursor as null when the page starts from the beginning', () => {
    const items = makeItems(3)
    const result = paginate(items, undefined, 10)
    expect(result.nextCursor).toBeNull()
  })

  it('returns items before the cursor', () => {
    const items = makeItems(10)
    const result = paginate(items, 'msg-8', 3)
    expect(result.items).toHaveLength(3)
    expect(result.items[0].id).toBe('msg-5')
    expect(result.items[2].id).toBe('msg-7')
  })

  it('returns empty array when cursor points to the first item', () => {
    const items = makeItems(5)
    const result = paginate(items, 'msg-1', 3)
    expect(result.items).toHaveLength(0)
    expect(result.nextCursor).toBeNull()
  })
})
