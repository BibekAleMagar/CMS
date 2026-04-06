# --- Stage 1: Base ---
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app

# --- Stage 2: Dependencies ---
FROM base AS deps
COPY pnpm-lock.yaml package.json ./
# Use pnpm fetch to cache dependencies
RUN pnpm fetch
COPY . .
RUN CI=true pnpm install --offline --frozen-lockfile

# --- Stage 3: Build ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# --- Stage 4: Production ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only what is needed to run the app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["node", "dist/main"]