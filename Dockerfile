FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy all project files
COPY . .

# Ensure pnpm is available before any install scripts that might require it
# Use corepack to provide pnpm reliably
RUN corepack enable && corepack prepare pnpm@10.16.1 --activate

# Install root dependencies (allow scripts, now that pnpm exists)
RUN npm install

# Install sharp with optional deps (needed for Next.js image optimization)
RUN npm install --include=optional sharp

# Ensure lemmy-js-client deps are installed and built (force non-interactive)
ENV CI=true
ENV PNPM_YES=true
ENV PNPM_COLORS=false
RUN cd src/lib/lemmy-js-client && pnpm install --force --no-frozen-lockfile --reporter=silent && pnpm run build || true

# Build the Next.js app
RUN npm run build

# Set correct permissions
RUN chown -R node:node /app
USER node

# Cleanup unnecessary files to shrink image size
RUN rm -rf src tests pages app *.md .gitignore .git .next/cache node_modules/.cache

EXPOSE 3000

CMD ["npm", "run", "start"]
