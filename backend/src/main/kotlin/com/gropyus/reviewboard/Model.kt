package com.gropyus.reviewboard

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import java.time.Instant

/** Exposed to clients via GET /api/statuses so the UI does not have to hardcode them. */
enum class ReviewStatus(val label: String, val order: Int) {
    TO_REVIEW("To review", 0),
    IN_REVIEW("In review", 1),
    APPROVED("Approved", 2),
}

/**
 * Geometry of a review item, serialised with a "type" discriminator, e.g.
 *   { "type": "box", "width": 1.2, "height": 0.8, "depth": 2.4, "color": "#5b8def" }
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = Geometry.Box::class, name = "box"),
    JsonSubTypes.Type(value = Geometry.Sphere::class, name = "sphere"),
    JsonSubTypes.Type(value = Geometry.Cylinder::class, name = "cylinder"),
    JsonSubTypes.Type(value = Geometry.Cone::class, name = "cone"),
)
sealed interface Geometry {
    val color: String

    data class Box(
        val width: Double,
        val height: Double,
        val depth: Double,
        override val color: String,
    ) : Geometry

    data class Sphere(
        val radius: Double,
        override val color: String,
    ) : Geometry

    data class Cylinder(
        val radiusTop: Double,
        val radiusBottom: Double,
        val height: Double,
        override val color: String,
    ) : Geometry

    data class Cone(
        val radius: Double,
        val height: Double,
        override val color: String,
    ) : Geometry
}

data class ReviewItem(
    val id: String,
    val name: String,
    val description: String,
    val status: ReviewStatus,
    val submittedBy: String,
    val updatedAt: Instant,
    val geometry: Geometry,
)

data class StatusDto(val id: ReviewStatus, val label: String, val order: Int)

data class UpdateStatusRequest(val status: ReviewStatus?)

data class ApiError(val error: String, val message: String)
