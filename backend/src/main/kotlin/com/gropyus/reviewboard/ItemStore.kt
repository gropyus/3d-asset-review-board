package com.gropyus.reviewboard

import org.springframework.stereotype.Component
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap

/** In-memory store, seeded on startup; state resets when the service restarts. */
@Component
class ItemStore {

    private val items = ConcurrentHashMap<String, ReviewItem>()

    init {
        seed().forEach { items[it.id] = it }
    }

    fun findAll(): List<ReviewItem> = items.values.sortedBy { it.id }

    fun findById(id: String): ReviewItem? = items[id]

    fun updateStatus(id: String, status: ReviewStatus): ReviewItem? =
        items.computeIfPresent(id) { _, item ->
            item.copy(status = status, updatedAt = Instant.now())
        }

    private fun seed(): List<ReviewItem> {
        val t = Instant.parse("2026-09-14T08:00:00Z")
        return listOf(
            ReviewItem(
                id = "itm-001",
                name = "Ventilation duct adapter",
                description = "Transition piece between the riser shaft and the in-ceiling duct run.",
                status = ReviewStatus.TO_REVIEW,
                submittedBy = "Planning Team A",
                updatedAt = t,
                geometry = Geometry.Box(width = 1.2, height = 0.8, depth = 2.4, color = "#5b8def"),
            ),
            ReviewItem(
                id = "itm-002",
                name = "Anchor sleeve",
                description = "Cast-in sleeve used to fix facade brackets to the timber slab.",
                status = ReviewStatus.TO_REVIEW,
                submittedBy = "Structures",
                updatedAt = t.plusSeconds(3600),
                geometry = Geometry.Cylinder(radiusTop = 0.35, radiusBottom = 0.35, height = 1.6, color = "#f2a65a"),
            ),
            ReviewItem(
                id = "itm-003",
                name = "Junction node",
                description = "Spherical node connecting three service lines above the corridor ceiling.",
                status = ReviewStatus.TO_REVIEW,
                submittedBy = "Building Services",
                updatedAt = t.plusSeconds(7200),
                geometry = Geometry.Sphere(radius = 0.9, color = "#63c7b2"),
            ),
            ReviewItem(
                id = "itm-004",
                name = "Tapered column cap",
                description = "Load distribution cap sitting on top of the ground floor column.",
                status = ReviewStatus.TO_REVIEW,
                submittedBy = "Structures",
                updatedAt = t.plusSeconds(10800),
                geometry = Geometry.Cone(radius = 1.0, height = 1.8, color = "#b07de8"),
            ),
            ReviewItem(
                id = "itm-005",
                name = "Floor cassette blank",
                description = "Standard floor cassette volume used for clash detection.",
                status = ReviewStatus.IN_REVIEW,
                submittedBy = "Planning Team B",
                updatedAt = t.plusSeconds(14400),
                geometry = Geometry.Box(width = 3.2, height = 0.4, depth = 2.8, color = "#5b8def"),
            ),
            ReviewItem(
                id = "itm-006",
                name = "Riser pipe segment",
                description = "One storey of the sanitary riser, used to validate shaft clearances.",
                status = ReviewStatus.IN_REVIEW,
                submittedBy = "Building Services",
                updatedAt = t.plusSeconds(18000),
                geometry = Geometry.Cylinder(radiusTop = 0.25, radiusBottom = 0.25, height = 2.9, color = "#f2a65a"),
            ),
            ReviewItem(
                id = "itm-007",
                name = "Balcony drain bowl",
                description = "Drainage bowl recessed into the balcony slab.",
                status = ReviewStatus.IN_REVIEW,
                submittedBy = "Planning Team A",
                updatedAt = t.plusSeconds(21600),
                geometry = Geometry.Cylinder(radiusTop = 0.6, radiusBottom = 0.2, height = 0.5, color = "#e8737d"),
            ),
            ReviewItem(
                id = "itm-008",
                name = "Wall panel blank",
                description = "Reference volume for a standard interior wall panel.",
                status = ReviewStatus.APPROVED,
                submittedBy = "Planning Team B",
                updatedAt = t.plusSeconds(25200),
                geometry = Geometry.Box(width = 2.6, height = 2.9, depth = 0.24, color = "#5b8def"),
            ),
            ReviewItem(
                id = "itm-009",
                name = "Insulation sphere sample",
                description = "Test volume used to calibrate the insulation material shader.",
                status = ReviewStatus.APPROVED,
                submittedBy = "Materials",
                updatedAt = t.plusSeconds(28800),
                geometry = Geometry.Sphere(radius = 1.25, color = "#63c7b2"),
            ),
        )
    }
}
