# Build stage: install everything and build the frontend.
FROM node:22-slim AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run web:build

# Runtime stage: production dependencies, backend source, evals and the built frontend.
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY src ./src
COPY evals ./evals
COPY --from=build /app/web/dist ./web/dist

ENV NODE_ENV=production
ENV MODEL_CACHE_DIR=/app/.cache/models

EXPOSE 3001

CMD ["node", "src/server.ts"]
