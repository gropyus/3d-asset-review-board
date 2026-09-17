# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app

# Copy the manifests first so dependency installation is cached across
# source changes.
COPY package.json package-lock.json* ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

# ---- run ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# Run as an unprivileged user rather than root.
USER node

EXPOSE 8080
CMD ["node", "dist/server.js"]
