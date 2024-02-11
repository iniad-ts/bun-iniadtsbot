import { Events } from "discord.js";

import { Event } from "../types";
import updatePresence from "../utils/updatePresence";

const readyEvent: Event<Events.ClientReady> = {
	name: Events.ClientReady,
	runOnce: true,
	execute: async (client) => {
		updatePresence(client);
		console.log(`Bot ready! Logged in as ${client.user.tag}.`);
	},
};

export default readyEvent;
