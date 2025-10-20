# --- Base Stage ---
FROM node:20-slim AS base

WORKDIR /app

# Install system dependencies for sharp
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm install --production --quiet

# --- Builder Stage ---
FROM base AS builder

# Enable pnpm via corepack for lemmy-js-client
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

# Verify pnpm installation
RUN pnpm --version

# Copy remaining project files, relying on .dockerignore to exclude node_modules
COPY . .

# Install all dependencies (including dev) for build
RUN npm install --quiet

# Install sharp explicitly to ensure compatibility
RUN npm install sharp --quiet

# Build lemmy-js-client with pnpm in a clean directory
ENV CI=true
ENV PNPM_YES=true
ENV PNPM_COLORS=false
RUN rm -rf src/lib/lemmy-js-client/node_modules && \
    cd src/lib/lemmy-js-client && \
    pnpm install --force --no-frozen-lockfile --silent && \
    pnpm run build

# Build Next.js app
RUN npm run build

# --- Final Stage ---
FROM node:20-slim

WORKDIR /app

# Install minimal system dependencies for sharp in final stage
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips42 \
    && rm -rf /var/lib/apt/lists/*

# Copy only necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Set non-root user for security
RUN chown -R node:node /app
USER node

# Expose port
EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3000 || exit 1

# Start the app
CMD ["npm", "start"]