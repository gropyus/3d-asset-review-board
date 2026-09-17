import express, { type Express, type NextFunction, type Request, type Response } from 'express'

import { HttpError, statusLabel } from './httpError.js'
import { ItemStore } from './itemStore.js'
import { itemRouter } from './itemRouter.js'
import type { ApiError } from './model.js'

/**
 * The frontend dev server proxies /api, so CORS is not normally exercised.
 * This allowlist only exists so the API can also be called directly from a
 * different local port. Local origins only, never "*".
 */
const ALLOWED_ORIGINS: ReadonlySet<string> = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
])

const ALLOWED_METHODS = 'GET, PATCH, OPTIONS'

function cors(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS)
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }

  // Answer the preflight here; it never needs to reach a route.
  if (req.method === 'OPTIONS') {
    res.sendStatus(origin && ALLOWED_ORIGINS.has(origin) ? 204 : 403)
    return
  }

  next()
}

export function createApp(store: ItemStore = new ItemStore()): Express {
  const app = express()

  app.disable('x-powered-by')
  app.use('/api', cors)
  app.use(express.json({ limit: '64kb' }))
  app.use('/api', itemRouter(store))

  app.use('/api', (req: Request) => {
    throw HttpError.notFound(`No endpoint for ${req.method} ${req.originalUrl}`)
  })

  app.use(errorHandler)

  return app
}

/**
 * Single place that turns an error into the API's error shape. A malformed body
 * or an unknown status value is answered with 400 rather than a 500, matching
 * the behaviour of the previous implementation.
 */
function errorHandler(err: unknown, _req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(err)
    return
  }

  const status = err instanceof HttpError ? err.status : 400
  const message =
    err instanceof Error && err.message ? err.message : 'Malformed request'

  const body: ApiError = { error: statusLabel(status), message }
  res.status(status).json(body)
}
