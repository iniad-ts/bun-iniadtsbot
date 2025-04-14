import { exec } from 'child_process';
import { REST, Routes } from "discord.js";
import { promisify } from 'util';

import { env } from "./env";
import { getCommands } from "./utils/core";

const execAsync = promisify(exec);

// Ensure Prisma client is generated before proceeding
async function ensurePrismaClientGenerated() {
  try {
    console.log('Generating Prisma client...');
    await execAsync('bun prisma generate');
  } catch (error) {
    console.error('Failed to generate Prisma client:', error);
    process.exit(1);
  }
}

// Call the function to ensure Prisma client is generated
await ensurePrismaClientGenerated();

const commands = await getCommands();
const data = commands.map((command) => command.data.toJSON());

const rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN);

console.log(
  `Deploying ${data.length} command${commands.length === 1 ? "" : "s"}...`,
);

rest
  .put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body: data })
  .then(() =>
    console.log(
      `Successfully deployed ${commands.length} command${
        commands.length === 1 ? "" : "s"
      }!`,
    ),
  )
  .catch(console.error);
