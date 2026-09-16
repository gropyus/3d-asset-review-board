# ---- build ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy the wrapper and POM first so dependency resolution is cached across
# source changes.
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -B -q dependency:go-offline

COPY src ./src
RUN ./mvnw -B -q clean package -DskipTests

# ---- run ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# Run as an unprivileged user rather than root.
RUN useradd --system --uid 10001 --create-home appuser
COPY --from=build /app/target/review-api-1.0.0.jar app.jar
USER appuser

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
