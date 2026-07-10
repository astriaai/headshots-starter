# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

# --- deps ---
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000

# --- builder ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* variables are inlined at build time, so they must be passed
# as build args in Dokploy (Build-time Variables), not only as runtime env.
# Provide real values — these end up in the client bundle.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_TUNE_TYPE=packs
ARG NEXT_PUBLIC_STRIPE_IS_ENABLED=false
ARG NEXT_PUBLIC_ANNOUNCEMENT_ENABLED=false
ARG NEXT_PUBLIC_ANNOUNCEMENT_MESSAGE=""

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_TUNE_TYPE=$NEXT_PUBLIC_TUNE_TYPE \
    NEXT_PUBLIC_STRIPE_IS_ENABLED=$NEXT_PUBLIC_STRIPE_IS_ENABLED \
    NEXT_PUBLIC_ANNOUNCEMENT_ENABLED=$NEXT_PUBLIC_ANNOUNCEMENT_ENABLED \
    NEXT_PUBLIC_ANNOUNCEMENT_MESSAGE=$NEXT_PUBLIC_ANNOUNCEMENT_MESSAGE

# Server-side vars only need to be PRESENT (and valid) so Next can load route
# modules during build-time page-data collection. They are NOT inlined into the
# output — the standalone server re-reads them from the real runtime env
# (docker-compose / Dokploy) on each request. Hence harmless build placeholders.
ENV APP_WEBHOOK_SECRET=build-placeholder \
    SUPABASE_SERVICE_ROLE_KEY=build-placeholder \
    ASTRIA_API_KEY=build-placeholder \
    PACK_QUERY_TYPE=both

RUN yarn build

# --- runner ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Bind to all interfaces so the container is reachable behind the Dokploy proxy.
ENV HOSTNAME=0.0.0.0
# Directory backed by the Dokploy volume mount (see docker-compose.yml).
ENV STORAGE_DIR=/data/uploads

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Next.js standalone output: minimal server + only the traced dependencies.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create the storage directory and hand it to the app user. When a volume is
# mounted at /data/uploads it takes over, but this keeps things working without one.
RUN mkdir -p /data/uploads && chown -R nextjs:nodejs /data

USER nextjs
EXPOSE 3000
VOLUME ["/data/uploads"]

CMD ["node", "server.js"]
