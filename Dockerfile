FROM denoland/deno:alpine AS builder
WORKDIR /app
COPY deno.json deno.lock ./
RUN deno cache .  
COPY . .
RUN deno task build

FROM denoland/deno:alpine AS runner
# Running as root (default) to ensure write access to SQLite DB
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
RUN deno install
EXPOSE 3000
ENV NODE_ENV=production
# Create a writable directory for the SQLite DB and expose it as a volume
# Create a writable directory and placeholder DB file
RUN mkdir -p /data && touch /data/timeseries.db && chmod 666 /data/timeseries.db
VOLUME /data
CMD ["deno", "run", "-A", "./build/index.js"]
