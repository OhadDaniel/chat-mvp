import type { Request, Response, NextFunction } from 'express'

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now()

  res.on('finish', () => {
    const durationMs = Date.now() - start
    const { method, originalUrl } = req
    const { statusCode } = res

    console.log(`[${method}] ${originalUrl} ${statusCode} - ${durationMs}ms`)
  })

  next()
}
