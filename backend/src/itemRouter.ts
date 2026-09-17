import { Router } from 'express'

import { HttpError } from './httpError.js'
import type { ItemStore } from './itemStore.js'
import { REVIEW_STATUSES, isReviewStatusId, serialiseItem } from './model.js'

export function itemRouter(store: ItemStore): Router {
  const router = Router()

  router.get('/statuses', (_req, res) => {
    const statuses = [...REVIEW_STATUSES].sort((a, b) => a.order - b.order)
    res.json(statuses)
  })

  router.get('/items', (_req, res) => {
    res.json(store.findAll().map(serialiseItem))
  })

  router.get('/items/:id', (req, res) => {
    const item = store.findById(req.params.id)
    if (!item) throw HttpError.notFound(`No item with id '${req.params.id}'`)

    res.json(serialiseItem(item))
  })

  router.patch('/items/:id/status', (req, res) => {
    const status: unknown = (req.body as Record<string, unknown> | undefined)?.status

    if (status === undefined || status === null) {
      throw HttpError.badRequest("Field 'status' is required")
    }
    if (!isReviewStatusId(status)) {
      const valid = REVIEW_STATUSES.map((s) => s.id).join(', ')
      throw HttpError.badRequest(`Invalid status '${String(status)}', expected one of: ${valid}`)
    }

    const updated = store.updateStatus(req.params.id, status)
    if (!updated) throw HttpError.notFound(`No item with id '${req.params.id}'`)

    res.json(serialiseItem(updated))
  })

  return router
}
