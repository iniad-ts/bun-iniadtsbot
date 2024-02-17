import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { Command } from "../types";
import officeAccessUseCase from "../usecase/officeAccessUseCase";
import updatePresence from "../utils/updatePresence";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const inCommand: Command<ChatInputCommandInteraction> = {
	data: new SlashCommandBuilder()
		.setName("in")
		.setDescription("入室用のコマンドです。")
		.addStringOption((option) =>
			option
				.setName("time")
				.setDescription(
					"入室の時間を指定します。HH:mm形式で入力してください。",
				),
		)
		.addStringOption((option) =>
			option
				.setName("date")
				.setDescription(
					"入室の日付を指定します。YYYY/MM/DD形式で入力してください。",
				),
		) as SlashCommandBuilder,
	execute: async (interaction) => {
		const time = interaction.options.getString("time");
		const date = interaction.options.getString("date");

		const timeIsValid = time ? dayjs(time, "HH:mm", true).isValid() : true;
		const dateIsValid = date ? dayjs(date, "YYYY/MM/DD", true).isValid() : true;

		if (!timeIsValid || !dateIsValid) {
			await interaction.reply(
				"入力された時間または日付の形式が正しくありません。",
			);
			return;
		}

		let dateTimeUTC: dayjs.Dayjs;
		if (!time && !date) {
			// timeもdateも存在しない場合: 現在時刻(Railway上はUTC)を取得
			dateTimeUTC = dayjs().utc();
		} else if (time && !date) {
			// timeのみ存在する場合: 現在の日付に時間を組み合わせ
			const now = dayjs()
				.hour(parseInt(time.split(":")[0]))
				.minute(parseInt(time.split(":")[1]));
			dateTimeUTC = now.utc();
			console.log(dateTimeUTC.format());
		} else {
			// timeとdateが存在する場合: そのまま使用
			const dateTime = dayjs(`${date} ${time}`);
			dateTimeUTC = dateTime.utc();
			console.log(dateTimeUTC.format());
		}
		try {
			await interaction.deferReply();
			await officeAccessUseCase.checkIn(
				BigInt(interaction.user.id),
				dateTimeUTC.toDate(),
				interaction.user.username,
			);
			updatePresence(interaction.client);
			await interaction.editReply(
				`入室時刻を以下のように記録しました:\n ${dateTimeUTC
					.tz("Asia/Tokyo")
					.format("YYYY/MM/DD HH:mm:ss")}`,
			);
		} catch (e) {
			await interaction.editReply(`エラーが発生しました: ${e.message}`);
		}
	},
};

export default inCommand;
