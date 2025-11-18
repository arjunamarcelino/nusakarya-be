# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies for tsx)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Stage 2: Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (tsx is needed at runtime for TypeScript execution)
RUN npm ci && npm cache clean --force

# Copy Prisma Client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy application source code
COPY index.ts ./
COPY app ./app
COPY prisma ./prisma
COPY types ./types
COPY tsconfig.json ./

# Expose port
EXPOSE 3000

# Health check (adjust endpoint if you have a health check route)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode < 500 ? 0 : 1)})" || exit 1

# Start the application
CMD ["npm", "start"]

