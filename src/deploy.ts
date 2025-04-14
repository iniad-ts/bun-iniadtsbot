import { exec } from 'child_process';
import { REST, Routes } from "discord.js";
import { promisify } from 'util';

import { env } from "./env";
import { getCommands } from "./utils/core";

// メイン処理を非同期関数で包む
async function main() {
  console.log("Deploy script started");

  try {
    const execAsync = promisify(exec);

    console.log('Generating Prisma client...');
    try {
      const { stdout, stderr } = await execAsync('bun prisma generate');
      console.log('Prisma generate output:', stdout);
      if (stderr) console.error('Prisma generate stderr:', stderr);
    } catch (error) {
      console.error('Failed to generate Prisma client:', error);
      process.exit(1);
    }

    console.log("Getting commands...");
    const commands = await getCommands();
    console.log(`Found ${commands.length} commands`);

    const data = commands.map((command) => command.data.toJSON());
    console.log("Commands data prepared for API");

    console.log("Setting up Discord REST client");
    const rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN);

    console.log(`Deploying ${data.length} command${commands.length === 1 ? "" : "s"}...`);

    // awaitを使って完了を待つ
    try {
      await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body: data });
      console.log(`Successfully deployed ${commands.length} command${commands.length === 1 ? "" : "s"}!`);
    } catch (error) {
      console.error("Error deploying commands:", error);
      process.exit(1);
    }

    console.log("Deploy script completed successfully");
  } catch (error) {
    console.error("Unexpected error in deploy script:", error);
    process.exit(1);
  }
}

// メイン関数を実行
main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
