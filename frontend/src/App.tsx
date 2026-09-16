import { useState } from 'react'
import { ShapePreview } from './components/ShapePreview'
import type { ReviewItem } from './types'

export default function App() {
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null)

  return (
    <div className="app">
      <header className="app__header">
        <h1>3D Asset Review Board</h1>
        <p className="app__subtitle">Review simple 3D assets before they are published.</p>
      </header>

      <main className="app__body">
        <section className="board">
          <div className="empty">
            <p>Nothing here yet.</p>
          </div>
        </section>

        <aside className="panel">
          <ShapePreview item={selectedItem} />
        </aside>
      </main>
    </div>
  )
}
