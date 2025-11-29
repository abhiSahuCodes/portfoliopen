# Node 20 LTS on Alpine (works for arm64)
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install only production deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source
COPY . .

# Expose API port
EXPOSE 5000

# Start
CMD ["node", "server.js"]