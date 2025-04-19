FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
RUN apt-get update -y && apt-get install -y openssl
COPY . .
RUN bun prisma generate
EXPOSE 3000
CMD ["/bin/sh", "-c", "bun prisma db push --accept-data-loss && bun run start"]
