FROM node:22-slim AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run web:build

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
