# Stage 1: React Frontend Build
FROM node:16 AS frontend-builder

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Node.js Backend
FROM node:16

WORKDIR /backend

COPY backend/package.json backend/package-lock.json ./
RUN npm install
COPY backend/ ./

# Copy React frontend build into the backend
COPY --from=frontend-builder /app/build /backend/public

EXPOSE 5002

CMD ["node", "server.js"]
