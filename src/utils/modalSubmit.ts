import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { ModalSubmitInteraction } from "discord.js";

// Day.jsのプラグインを有効化
dayjs.extend(utc);
dayjs.extend(timezone);

export async function handleModalSubmit(interaction: ModalSubmitInteraction) {
	if (interaction.customId === "checkInModal") {
		const date = interaction.fields.getTextInputValue("date");
		const time = interaction.fields.getTextInputValue("time");

		// 日付と時間のバリデーション
		const timeIsValid = time ? dayjs(time, "HH:mm", true).isValid() : false;
		const dateIsValid = date
			? dayjs(date, "YYYY/MM/DD", true).isValid()
			: false;

		if (!timeIsValid || !dateIsValid) {
			await interaction.reply(
				"入力された時間または日付の形式が正しくありません。",
			);
			return;
		}

		const dateTimeUTC = dayjs(`${date} ${time}`, "YYYY/MM/DD HH:mm")
			.tz("Asia/Tokyo", true)
			.utc();

		try {
			console.log(dateTimeUTC.format());
			await interaction.reply(
				`入室時刻を以下のように記録しました: ${dateTimeUTC
					.tz("Asia/Tokyo")
					.format("YYYY/MM/DD HH:mm:ss")}`,
			);
		} catch (error) {
			await interaction.reply(`エラーが発生しました: ${error.message}`);
		}
	}
	if (interaction.customId === "checkOutModal") {
	}
}
