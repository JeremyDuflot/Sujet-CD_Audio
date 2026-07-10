FROM node:lts-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY index.html ./
COPY vite.config.js ./
COPY src ./src
RUN npm run build
FROM nginxinc/nginx-unprivileged:stable AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]