FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install
RUN apt-get update -y && apt-get install -y openssl
RUN bun prisma generate

COPY . .

EXPOSE 3000
CMD ["/bin/sh", "-c", "bun prisma db push && bun prisma generate && bun prisma generate && bun run start"]
