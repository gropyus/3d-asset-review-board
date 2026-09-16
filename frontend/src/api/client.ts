import type { ReviewItem, ReviewStatus, ReviewStatusId } from '../types'

/**
 * Requests go to a relative /api path; the Vite dev server proxies them to the
 * Kotlin backend (see vite.config.ts), so there is no CORS setup to worry about.
 */

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`/api${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
  } catch (cause) {
    // Network-level failure: backend not running, connection dropped, etc.
    throw new ApiError(0, 'Could not reach the review service.')
  }

  if (!response.ok) {
    const message = await response
      .json()
      .then((body: { message?: string }) => body?.message)
      .catch(() => undefined)
    throw new ApiError(response.status, message ?? `Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

export function getStatuses(): Promise<ReviewStatus[]> {
  return request<ReviewStatus[]>('/statuses')
}

export function getItems(): Promise<ReviewItem[]> {
  return request<ReviewItem[]>('/items')
}

export function getItem(id: string): Promise<ReviewItem> {
  return request<ReviewItem>(`/items/${id}`)
}

export function updateItemStatus(id: string, status: ReviewStatusId): Promise<ReviewItem> {
  return request<ReviewItem>(`/items/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}
