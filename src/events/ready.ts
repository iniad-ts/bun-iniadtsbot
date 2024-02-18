import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Events,
} from "discord.js";

import { env } from "../env";
import { Event } from "../types";
import { buildEmbed } from "../utils/generateShowMessage";
import updatePresence from "../utils/updatePresence";

const readyEvent: Event<Events.ClientReady> = {
	name: Events.ClientReady,
	runOnce: true,
	execute: async (client) => {
		updatePresence(client);

		console.log(`Bot ready! Logged in as ${client.user.tag}.`);

		//再起動時に特定チャンネルに/showの中身を送信する処理. 再起動跨いでも更新できそうなのでコメントアウト

		// const channelId = env.DISCORD_SHOW_CHANNEL_ID;

		// const channel = client.channels.cache.get(channelId);
		// if (!channel) {
		// 	console.log(`Channel with ID ${channelId} was not found.`);
		// 	return;
		// }
		// if (!channel.isTextBased()) {
		// 	console.log(`Channel with ID ${channelId} is not a text channel.`);
		// 	return;
		// }

		// const embed = await buildEmbed();

		// const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
		// 	new ButtonBuilder()
		// 		.setCustomId("refresh")
		// 		.setLabel("更新")
		// 		.setStyle(ButtonStyle.Primary),
		// );

		// await channel.send({ embeds: [embed], components: [row] });

		// const filter = (i) =>
		// 	i.customId === "refresh" && i.user.id === client.user.id;
		// const collector = channel.createMessageComponentCollector({
		// 	filter,
		// 	time: 15000,
		// });

		// collector.on("collect", async (i) => {
		// 	if (i.customId === "refresh") {
		// 		const updatedEmbed = await buildEmbed();
		// 		await i.update({ embeds: [updatedEmbed], components: [row] });
		// 	}
		// });
	},
};

export default readyEvent;
