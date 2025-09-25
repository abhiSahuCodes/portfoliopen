# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy source and build
COPY . .
# Optional: You can pass a public build-time variable if needed:
# ARG VITE_API_URL
# ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Runtime stage (Nginx)
FROM nginx:1.25-alpine AS runtime

# Clean default site
RUN rm -f /etc/nginx/conf.d/default.conf

# Custom site config (lives in frontend/nginx.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]