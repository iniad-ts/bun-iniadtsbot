import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../types";
import { buildEmbed } from "../utils/generateShowMessage";

const showCommand: Command<ChatInputCommandInteraction> = {
	data: new SlashCommandBuilder()
		.setName("show")
		.setDescription("入室中のユーザーを表示します。") as SlashCommandBuilder,
	execute: async (interaction) => {
		await interaction.deferReply();
		const embed = await buildEmbed();

		//TODO: in/outもボタンで操作できるようにする?
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("refresh")
				.setLabel("更新")
				.setStyle(ButtonStyle.Primary),
		);

		if (!interaction.channel) {
			console.log("Channel is not available.");
			await interaction.editReply(
				"適切なチャンネルが見つかりませんでした。\n処理を中断します。",
			);
			return;
		}

		await interaction.editReply({ embeds: [embed], components: [row] });
	},
};

export default showCommand;
