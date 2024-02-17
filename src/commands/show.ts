import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"; // タイムゾーン用のプラグインをインポート
import utc from "dayjs/plugin/utc";
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../types";
import officeAccessUseCase from "../usecase/officeAccessUsecase";

dayjs.extend(utc);
dayjs.extend(timezone);

const showCommand: Command<ChatInputCommandInteraction> = {
	data: new SlashCommandBuilder()
		.setName("show")
		.setDescription("入室中のユーザーを表示します。") as SlashCommandBuilder,
	execute: async (interaction) => {
		await interaction.deferReply();
		const unCheckedOutInfo = await officeAccessUseCase.show();

		const embed = new EmbedBuilder()
			.setTitle("入室中のユーザー")
			.setColor("#0099ff");

		const embedFields = unCheckedOutInfo.uncheckedOutRecords.map((record) => {
			const user = unCheckedOutInfo.users.find(
				(u) => u.user_id === record.user_id,
			);
			if (user) {
				const formattedCheckIn = dayjs(record.check_in)
					.tz("Asia/Tokyo")
					.format("YYYY/MM/DD HH:mm:ss");

				return {
					name: user.user_name,
					value: `入室時間: ${formattedCheckIn}`,
				};
			}
		});

		for (const field of embedFields) {
			if (field) {
				embed.addFields(field);
			}
		}
		if (embedFields.length === 0) {
			embed.setDescription("入室中のユーザーはいません。");
		}

		await interaction.editReply({ embeds: [embed] });
	},
};

export default showCommand;
