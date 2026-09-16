import { useEffect } from 'react'
import * as THREE from 'three'
import { useThreeScene } from '../three/useThreeScene'
import type { ReviewItem } from '../types'

interface ShapePreviewProps {
  item: ReviewItem | null
}

export function ShapePreview({ item }: ShapePreviewProps) {
  const { containerRef, threeScene } = useThreeScene()

  useEffect(() => {
    if (!threeScene || !item) return
  }, [threeScene, item])

  return (
    <div className="preview">
      <div className="preview__canvas" ref={containerRef} />
      {!item && <p className="preview__placeholder">Select an item to preview its shape.</p>}
    </div>
  )
}
