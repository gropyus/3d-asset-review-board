export type ReviewStatusId = 'TO_REVIEW' | 'IN_REVIEW' | 'APPROVED'

export interface ReviewStatus {
  id: ReviewStatusId
  label: string
  order: number
}

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

export type Geometry = BoxGeometry | SphereGeometry | CylinderGeometry

export interface ReviewItem {
  id: string
  name: string
  description: string
  status: ReviewStatusId
  submittedBy: string
  /** ISO-8601 timestamp */
  updatedAt: string
  geometry: Geometry
}
