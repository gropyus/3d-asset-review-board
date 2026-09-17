import type { ReviewItem, ReviewStatusId } from './model.js'

const SEED_EPOCH = Date.parse('2026-09-14T08:00:00Z')

/** `SEED_EPOCH` shifted by whole hours, mirroring the original seed offsets. */
function hoursIn(hours: number): Date {
  return new Date(SEED_EPOCH + hours * 3600 * 1000)
}

/** In-memory store, seeded on startup; state resets when the service restarts. */
export class ItemStore {
  private readonly items = new Map<string, ReviewItem>()

  constructor() {
    for (const item of seed()) {
      this.items.set(item.id, item)
    }
  }

  findAll(): ReviewItem[] {
    return [...this.items.values()].sort((a, b) => a.id.localeCompare(b.id))
  }

  findById(id: string): ReviewItem | undefined {
    return this.items.get(id)
  }

  updateStatus(id: string, status: ReviewStatusId): ReviewItem | undefined {
    const existing = this.items.get(id)
    if (!existing) return undefined

    const updated: ReviewItem = { ...existing, status, updatedAt: new Date() }
    this.items.set(id, updated)
    return updated
  }
}

function seed(): ReviewItem[] {
  return [
    {
      id: 'itm-001',
      name: 'Ventilation duct adapter',
      description: 'Transition piece between the riser shaft and the in-ceiling duct run.',
      status: 'TO_REVIEW',
      submittedBy: 'Planning Team A',
      updatedAt: hoursIn(0),
      geometry: { type: 'box', width: 1.2, height: 0.8, depth: 2.4, color: '#5b8def' },
    },
    {
      id: 'itm-002',
      name: 'Anchor sleeve',
      description: 'Cast-in sleeve used to fix facade brackets to the timber slab.',
      status: 'TO_REVIEW',
      submittedBy: 'Structures',
      updatedAt: hoursIn(1),
      geometry: { type: 'cylinder', radiusTop: 0.35, radiusBottom: 0.35, height: 1.6, color: '#f2a65a' },
    },
    {
      id: 'itm-003',
      name: 'Junction node',
      description: 'Spherical node connecting three service lines above the corridor ceiling.',
      status: 'TO_REVIEW',
      submittedBy: 'Building Services',
      updatedAt: hoursIn(2),
      geometry: { type: 'sphere', radius: 0.9, color: '#63c7b2' },
    },
    {
      id: 'itm-004',
      name: 'Tapered column cap',
      description: 'Load distribution cap sitting on top of the ground floor column.',
      status: 'TO_REVIEW',
      submittedBy: 'Structures',
      updatedAt: hoursIn(3),
      geometry: { type: 'cone', radius: 1.0, height: 1.8, color: '#b07de8' },
    },
    {
      id: 'itm-005',
      name: 'Floor cassette blank',
      description: 'Standard floor cassette volume used for clash detection.',
      status: 'IN_REVIEW',
      submittedBy: 'Planning Team B',
      updatedAt: hoursIn(4),
      geometry: { type: 'box', width: 3.2, height: 0.4, depth: 2.8, color: '#5b8def' },
    },
    {
      id: 'itm-006',
      name: 'Riser pipe segment',
      description: 'One storey of the sanitary riser, used to validate shaft clearances.',
      status: 'IN_REVIEW',
      submittedBy: 'Building Services',
      updatedAt: hoursIn(5),
      geometry: { type: 'cylinder', radiusTop: 0.25, radiusBottom: 0.25, height: 2.9, color: '#f2a65a' },
    },
    {
      id: 'itm-007',
      name: 'Balcony drain bowl',
      description: 'Drainage bowl recessed into the balcony slab.',
      status: 'IN_REVIEW',
      submittedBy: 'Planning Team A',
      updatedAt: hoursIn(6),
      geometry: { type: 'cylinder', radiusTop: 0.6, radiusBottom: 0.2, height: 0.5, color: '#e8737d' },
    },
    {
      id: 'itm-008',
      name: 'Wall panel blank',
      description: 'Reference volume for a standard interior wall panel.',
      status: 'APPROVED',
      submittedBy: 'Planning Team B',
      updatedAt: hoursIn(7),
      geometry: { type: 'box', width: 2.6, height: 2.9, depth: 0.24, color: '#5b8def' },
    },
    {
      id: 'itm-009',
      name: 'Insulation sphere sample',
      description: 'Test volume used to calibrate the insulation material shader.',
      status: 'APPROVED',
      submittedBy: 'Materials',
      updatedAt: hoursIn(8),
      geometry: { type: 'sphere', radius: 1.25, color: '#63c7b2' },
    },
  ]
}