FROM node:20-slim AS base

# Install system dependencies
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
    openssl \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Development dependencies for building
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the project
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user with specific UID/GID
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs sveltekit

# Copy built application
COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=deps --chown=sveltekit:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./package.json
COPY --from=builder --chown=sveltekit:nodejs /app/prisma ./prisma
COPY --chown=sveltekit:nodejs startup.sh ./startup.sh

# Create necessary directories with proper permissions
RUN mkdir -p /app/logs /app/tmp && \
    chown -R sveltekit:nodejs /app && \
    chmod +x /app/startup.sh

# Switch to non-root user
USER sveltekit

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:4015/health || exit 1

EXPOSE 4015

CMD ["./startup.sh"]