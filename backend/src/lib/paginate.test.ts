import { describe, it, expect } from 'vitest'
import { paginate } from './paginate'

describe('paginate', () => {
  const items = ['a', 'b', 'c', 'd', 'e']

  it('returns first page when no cursor is given', () => {
    const { items: page, nextCursor } = paginate(items, undefined, 2)
    expect(page).toEqual(['a', 'b'])
    expect(nextCursor).toBe('b')
  })

  it('returns next page when cursor is provided', () => {
    const { items: page, nextCursor } = paginate(items, 'b', 2)
    expect(page).toEqual(['c', 'd'])
    expect(nextCursor).toBe('d')
  })

  it('returns null nextCursor on the last page', () => {
    const { items: page, nextCursor } = paginate(items, 'd', 2)
    expect(page).toEqual(['e'])
    expect(nextCursor).toBeNull()
  })
})
