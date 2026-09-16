package com.gropyus.reviewboard

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@SpringBootApplication
class ReviewBoardApplication

/**
 * The frontend dev server proxies /api, so CORS is not normally exercised.
 * This allowlist only exists so the API can also be called directly from a
 * different local port. Local origins only, never "*".
 */
@Configuration
class WebConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
            )
            .allowedMethods("GET", "PATCH", "OPTIONS")
    }
}

fun main(args: Array<String>) {
    runApplication<ReviewBoardApplication>(*args)
}
