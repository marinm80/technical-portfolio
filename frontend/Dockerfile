FROM node:22-alpine AS builder
WORKDIR /app

# Vite inyecta las VITE_* en build-time; sin ellas el sitio funciona
# en modo degradado (blog vacío, contacto con fallback mailto).
ARG VITE_WP_API_URL
ARG VITE_EMAILJS_SERVICE_ID
ARG VITE_EMAILJS_TEMPLATE_ID
ARG VITE_EMAILJS_PUBLIC_KEY
ENV VITE_WP_API_URL=$VITE_WP_API_URL \
    VITE_EMAILJS_SERVICE_ID=$VITE_EMAILJS_SERVICE_ID \
    VITE_EMAILJS_TEMPLATE_ID=$VITE_EMAILJS_TEMPLATE_ID \
    VITE_EMAILJS_PUBLIC_KEY=$VITE_EMAILJS_PUBLIC_KEY

COPY package*.json ./
RUN npm ci
COPY . .
# El type-check completo (tsc -b) corre en CI; aquí solo se empaqueta.
RUN npx vite build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
