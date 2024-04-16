import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { ModalSubmitInteraction } from "discord.js";
import officeAccessUseCase from "../../usecase/officeAccessUseCase";
import { roleManage } from "../roleManage";
import updatePresence from "../updatePresence";

dayjs.extend(utc);
dayjs.extend(timezone);

async function processDateTime(date: string, time: string) {
  const timeIsValid = time ? dayjs(time, "HH:mm", true).isValid() : false;
  const dateIsValid = date ? dayjs(date, "YYYY/MM/DD", true).isValid() : false;

  if (!timeIsValid || !dateIsValid) {
    return {
      message: "入力された時間または日付の形式が正しくありません。",
      dateTimeUTC: null,
    };
  }

  const dateTimeUTC = dayjs(`${date} ${time}`, "YYYY/MM/DD HH:mm")
    .tz("Asia/Tokyo", true)
    .utc();

  return {
    message: null,
    dateTimeUTC,
  };
}

export async function handleModalSubmit(interaction: ModalSubmitInteraction) {
  const date = interaction.fields.getTextInputValue("date");
  const time = interaction.fields.getTextInputValue("time");

  const { message, dateTimeUTC } = await processDateTime(date, time);

  if (!dateTimeUTC) {
    await interaction.reply(message);
    return;
  }

  try {
    if (interaction.customId === "checkInModal") {
      await officeAccessUseCase.fixIn(
        BigInt(interaction.user.id),
        dateTimeUTC.toDate(),
        interaction.user.username,
      );
      await roleManage.addRole(interaction);
      updatePresence(interaction.client);
      await interaction.reply(
        `入室時刻を以下のように記録しました: \n${dateTimeUTC
          .tz("Asia/Tokyo")
          .format("YYYY/MM/DD HH:mm:ss")}`,
      );
    } else if (interaction.customId === "checkOutModal") {
      await officeAccessUseCase.fixOut(
        BigInt(interaction.user.id),
        dateTimeUTC.toDate(),
      );
      await roleManage.removeRole(interaction);
      updatePresence(interaction.client);
      await interaction.reply(
        `退室時刻を以下のように記録しました: \n${dateTimeUTC
          .tz("Asia/Tokyo")
          .format("YYYY/MM/DD HH:mm:ss")}`,
      );
    }
  } catch (error) {
    await interaction.reply("エラーが発生しました。");
  }
}
