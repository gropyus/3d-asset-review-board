# Dev-server image: files are edited on the host and the container picks them
# up through the bind mount declared in docker-compose.yml.
FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
