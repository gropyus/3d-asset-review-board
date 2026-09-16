package com.gropyus.reviewboard

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api")
class ItemController(
    private val store: ItemStore,
) {

    @GetMapping("/statuses")
    fun statuses(): List<StatusDto> {
        return ReviewStatus.entries
            .sortedBy { it.order }
            .map { StatusDto(id = it, label = it.label, order = it.order) }
    }

    @GetMapping("/items")
    fun items(): List<ReviewItem> {
        return store.findAll()
    }

    @GetMapping("/items/{id}")
    fun item(@PathVariable id: String): ReviewItem {
        return store.findById(id)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "No item with id '$id'")
    }

    @PatchMapping("/items/{id}/status")
    fun updateStatus(
        @PathVariable id: String,
        @RequestBody body: UpdateStatusRequest,
    ): ReviewItem {
        val status = body.status
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Field 'status' is required")

        return store.updateStatus(id, status)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "No item with id '$id'")
    }
}

@RestControllerAdvice
class ApiExceptionHandler {

    @ExceptionHandler(ResponseStatusException::class)
    fun handleStatus(ex: ResponseStatusException): ResponseEntity<ApiError> =
        ResponseEntity
            .status(ex.statusCode)
            .body(ApiError(error = ex.statusCode.toString(), message = ex.reason ?: "Request failed"))

    /** An unparseable status value lands here; answer with 400 rather than a 500. */
    @ExceptionHandler(Exception::class)
    fun handleFallback(ex: Exception): ResponseEntity<ApiError> =
        ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiError(error = "400 BAD_REQUEST", message = ex.message ?: "Malformed request"))
}
