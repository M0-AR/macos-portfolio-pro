# NOTE: if your builder egress-filters npm (sandbox/allowlisted CI), build with
# DOCKER_BUILDKIT=1 docker build --network=host ... (compose already sets build.network).
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json package-lock.json* .npmrc* ./
# Flaky-registry hardening (crowded hosts / throttled egress): bounded retries
# with npm-side fetch retries, still fails loud if truly offline.
RUN ok=0; for i in 1 2 3; do \
      if npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000; then ok=1; break; fi; \
      echo "npm ci failed (try $i/3), retrying..."; sleep 10; \
    done; \
    [ "$ok" = "1" ]

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV HOSTNAME=0.0.0.0 PORT=3000
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]

FROM base AS dev
WORKDIR /app
COPY package.json package-lock.json* ./
RUN ok=0; for i in 1 2 3; do \
      if npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000; then ok=1; break; fi; \
      echo "npm ci failed (try $i/3), retrying..."; sleep 10; \
    done; \
    [ "$ok" = "1" ]
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "-p", "3000", "-H", "0.0.0.0"]
