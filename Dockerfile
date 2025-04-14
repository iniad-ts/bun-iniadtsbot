FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install
RUN bun prisma generate

COPY . .

EXPOSE 3000
CMD ["bun", "prisma", "generate", "&&", "bun", "run", "start"]
