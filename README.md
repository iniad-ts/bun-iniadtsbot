# 📝 discord-bot-template

A type-safe Discord.js v14 boilerplate built with [TypeScript](https://www.typescriptlang.org) and the [Bun](https://bun.sh) runtime.

## Features

- Usage of Discord interactions (application/"slash" commands)
- Type-safe environment variable validation with [t3-env](https://env.t3.gg)
- Example `/ping` and `/purge` commands
- Command and event handlers
- Prettier integration

## Contributions

Feel free to share your ideas, report issues, and help make discord-bot-template even better!

## Setup

Clone the project

```bash
git clone https://github.com/aelew/discord-bot-template.git
```

Go to the project directory

```bash
cd discord-bot-template
```

Install dependencies

```bash
bun install
```

Set environment variables

```
To run this project, you need to set the required environment variables.
Copy `.env.example` into a new file called `.env` and fill in the values.
```

Deploy application commands

```bash
bun run deploy
```

Start the bot

```bash
bun run start
```

## Scripts

```bash
bun run start # start the bot
bun run prettier # format code
bun run deploy # deploy commands(run after adding/modifying command data)
```

## docker 起動

```bash
docker compose up -d
```

## Prismaのセットアップ

```bash
npx prisma migrate dev
npx prisma generate
```

## Prismaのスキーマを変更する場合

```bash
npx prisma db push
npx prisma generate
```

## prisma studio 起動

```bash
npx prisma studio
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
