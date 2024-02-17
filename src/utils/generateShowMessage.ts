import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { EmbedBuilder } from "discord.js";
import officeAccessUseCase from "../usecase/officeAccessUseCase";

dayjs.extend(timezone);

export const buildEmbed = async () => {
	const unCheckedOutInfo = await officeAccessUseCase.show();
	const embed = new EmbedBuilder()
		.setTitle("入室中のユーザー")
		.setColor("#0099ff");

	const embedFields = unCheckedOutInfo.uncheckedOutRecords
		.map((record) => {
			const user = unCheckedOutInfo.users.find(
				(u) => u.user_id === record.user_id,
			);
			if (user) {
				const formattedCheckIn = dayjs(record.check_in)
					.tz("Asia/Tokyo")
					.format("YYYY/MM/DD HH:mm:ss");
				return { name: user.user_name, value: `入室時間: ${formattedCheckIn}` };
			}
			return null;
		})
		.filter((field) => field !== null);

	if (embedFields.length === 0) {
		embed.setDescription("入室中のユーザーはいません。");
	}
	for (const field of embedFields) {
		if (field) {
			embed.addFields(field);
		}
	}
	const updatedTime = dayjs().tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss");
	embed.setFooter({ text: `最終更新: ${updatedTime}` });

	return embed;
};
