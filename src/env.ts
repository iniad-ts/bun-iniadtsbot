import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	runtimeEnv: process.env,
	server: {
		DISCORD_BOT_TOKEN: z.string(),
		DATABASE_URL: z.string(),
		DISCORD_GUILD_ID: z.string(),
		DISCORD_CLIENT_ID: z.string(),
	},
});
