# Dockerfile for Survey Site (Node 20 Alpine)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Set production environment (affects dependencies)
ENV NODE_ENV=production

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Expose app port (default; can be overridden via env)
EXPOSE 3000

# Start the server (ensure your project has a start script or server.js)
# Prefer npm run start if defined; fallback to server.js
CMD ["sh", "-c", "if npm run | grep -q '^  start'; then npm run start; else node server.js; fi"]
