FROM node:lts-bookworm AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g corepack@latest
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder

ARG NEXT_PUBLIC_CLAVE_UNICA_LOGOUT_URL
ENV NEXT_PUBLIC_CLAVE_UNICA_LOGOUT_URL=$NEXT_PUBLIC_CLAVE_UNICA_LOGOUT_URL
ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=true

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g corepack@latest
RUN corepack enable pnpm && pnpm run build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENTRYPOINT [ "./entrypoint.sh" ]