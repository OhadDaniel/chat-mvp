export function recallAtK(expected: string[], retrieved: string[]): number {
  if (expected.length === 0) {
    return 1
  }
  const found = expected.filter(source => retrieved.includes(source)).length
  return found / expected.length
}

export function answerCovers(answer: string, mustInclude: string[]): boolean {
  const lower = answer.toLowerCase()
  return mustInclude.every(token => lower.includes(token.toLowerCase()))
}
