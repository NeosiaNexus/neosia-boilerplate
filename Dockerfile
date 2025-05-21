# syntax=docker/dockerfile:1

FROM oven/bun:1.2.13-alpine AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

FROM oven/bun:1.2.13-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules

COPY prisma ./prisma
COPY . .

RUN bunx prisma generate

RUN bun --bun run build

FROM oven/bun:1.2.13-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public       ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static    ./.next/static

USER bun

EXPOSE 3000
ENTRYPOINT ["bun", "server.js"]
