# -------------------------------------------------------------------
# Stage 1: Build & Dependencies
# -------------------------------------------------------------------
FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build Vite SPA with production backend URL
ENV VITE_SERVER_URL=https://valyou-server-816429071569.asia-southeast1.run.app
ENV VITE_API_URL=https://valyou-server-816429071569.asia-southeast1.run.app/api

RUN npm run build

# -------------------------------------------------------------------
# Stage 2: Production Nginx Server
# -------------------------------------------------------------------
FROM nginx:alpine-slim AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
