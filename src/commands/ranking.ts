import {
	EmbedBuilder,
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";
import type { Command } from "../types";
import officeAccessUseCase from "../usecase/officeAccessUseCase";

const showCommand: Command<ChatInputCommandInteraction> = {
	data: new SlashCommandBuilder()
		.setName("ranking")
		.setDescription("滞在時間のランキングを表示します。")
		.addStringOption((option) =>
			option.setName("from").setDescription("開始日").setRequired(true),
		)
		.addStringOption((option) =>
			option.setName("until").setDescription("終了日").setRequired(true),
		) as SlashCommandBuilder,
	execute: async (interaction) => {
		try {
			await interaction.deferReply();
			const { from, until } = (() => {
				const fromString = interaction.options.getString("from");
				const untilString = interaction.options.getString("until");

				if (fromString !== null && untilString !== null)
					return { from: new Date(fromString), until: new Date(untilString) };
				if (fromString !== null)
					return { from: new Date(fromString), until: new Date() };
				if (untilString !== null)
					return { from: new Date(0), until: new Date(untilString) };

				const currentDate = new Date();
				const startOfMonth = (() => {
					const now = new Date();
					const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
					return startOfMonth;
				})();

				return { from: startOfMonth, until: currentDate };
			})();

			for (const date of [from, until]) {
				if (date.toString() === "Invalid Date") {
					await interaction.editReply({ content: "日付の形式が不正です。" });
					return;
				}
			}

			const rankingData = await officeAccessUseCase.ranking(from, until);
			const embed = new EmbedBuilder()
				.setTitle("滞在時間のランキング")
				.setColor("#0099ff");
			const top25RankingData = rankingData.slice(0, 25);

			const embedFields = top25RankingData.map((data, index) => {
				return {
					name: `${index + 1}位: ${data.user?.user_name}`,
					value: `滞在時間: ${data.stayTime}`,
				};
			});

			for (const field of embedFields) {
				embed.addFields(field);
			}

			await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			console.error(error);
			await interaction.editReply({ content: "エラーが発生しました。" });
		}
	},
};

export default showCommand;
