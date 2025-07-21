FROM node:20-slim
WORKDIR /app

# Copy dependency files and install dependencies
COPY . .
RUN npm install -g pnpm
RUN npm install --include=optional sharp
RUN npm i
# Build the Next.js app
RUN npm run build

# Set correct permissions
RUN chown -R node:node /app
USER node

RUN rm -rf src tests pages app *.md .gitignore .git .next/cache node_modules/.cache

EXPOSE 3000
CMD ["npm", "run", "start"]