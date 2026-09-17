/** Exposed to clients via GET /api/statuses so the UI does not have to hardcode them. */
export const REVIEW_STATUSES = [
  { id: 'TO_REVIEW', label: 'To review', order: 0 },
  { id: 'IN_REVIEW', label: 'In review', order: 1 },
  { id: 'APPROVED', label: 'Approved', order: 2 },
] as const satisfies readonly StatusDto[]

export type ReviewStatusId = (typeof REVIEW_STATUSES)[number]['id']

export interface StatusDto {
  id: string
  label: string
  order: number
}

const STATUS_IDS: ReadonlySet<string> = new Set(REVIEW_STATUSES.map((s) => s.id))

export function isReviewStatusId(value: unknown): value is ReviewStatusId {
  return typeof value === 'string' && STATUS_IDS.has(value)
}

/**
 * Geometry of a review item, serialised with a "type" discriminator, e.g.
 *   { "type": "box", "width": 1.2, "height": 0.8, "depth": 2.4, "color": "#5b8def" }
 */
export interface BoxGeometry {
  type: 'box'
  width: number
  height: number
  depth: number
  color: string
}

export interface SphereGeometry {
  type: 'sphere'
  radius: number
  color: string
}

export interface CylinderGeometry {
  type: 'cylinder'
  radiusTop: number
  radiusBottom: number
  height: number
  color: string
}

export interface ConeGeometry {
  type: 'cone'
  radius: number
  height: number
  color: string
}

export type Geometry = BoxGeometry | SphereGeometry | CylinderGeometry | ConeGeometry

export interface ReviewItem {
  id: string
  name: string
  description: string
  status: ReviewStatusId
  submittedBy: string
  updatedAt: Date
  geometry: Geometry
}

export interface ApiError {
  error: string
  message: string
}

/**
 * ISO-8601 with a trailing Z and no millisecond part when it is zero, which is
 * what the previous Jackson-based API emitted for an Instant.
 */
export function formatInstant(date: Date): string {
  return date.toISOString().replace(/\.000Z$/, 'Z')
}

/** Wire representation of an item: the Date becomes an ISO-8601 string. */
export function serialiseItem(item: ReviewItem): Record<string, unknown> {
  return { ...item, updatedAt: formatInstant(item.updatedAt) }
}