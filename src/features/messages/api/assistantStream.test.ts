import { describe, it, expect } from 'vitest'
import { parseSseFrames } from './assistantStream.api'

describe('parseSseFrames', () => {
  it('parses complete frames and keeps the incomplete remainder in rest', () => {
    const buffer =
      'event: delta\ndata: {"text":"Hi"}\n\n' +
      'event: delta\ndata: {"text":" there"}\n\n' +
      'event: done\ndata: {"messageId":"m1"}'

    const { frames, rest } = parseSseFrames(buffer)

    expect(frames).toEqual([
      { event: 'delta', data: '{"text":"Hi"}' },
      { event: 'delta', data: '{"text":" there"}' },
    ])
    expect(rest).toBe('event: done\ndata: {"messageId":"m1"}')
  })

  it('returns no frames when only a partial frame is buffered', () => {
    const partial = 'event: delta\ndata: {"text":"par'
    const { frames, rest } = parseSseFrames(partial)

    expect(frames).toEqual([])
    expect(rest).toBe(partial)
  })
})
