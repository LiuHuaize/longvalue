# Backend Dockerfile
FROM node:18-alpine

# Install pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --prod

# Copy server files
COPY . .

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "server.js"]