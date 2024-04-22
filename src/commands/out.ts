import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import type { Command } from "../types";
import officeAccessUseCase from "../usecase/officeAccessUseCase";
import { roleManage } from "../utils/roleManage";
import updatePresence from "../utils/updatePresence";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.extend(customParseFormat);

const outCommand: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("out")
    .setDescription("退室用のコマンドです。") as SlashCommandBuilder,
  execute: async (interaction) => {
    const dateTimeUTC = dayjs().utc();

    try {
      await interaction.deferReply();
      const record = await officeAccessUseCase.checkOut(
        BigInt(interaction.user.id),
        dateTimeUTC.toDate(),
      );
      await roleManage.removeRole(interaction);
      updatePresence(interaction.client);
      const stayTime = dayjs(record.check_out).diff(
        dayjs(record.check_in),
        "minute",
      );
      await interaction.editReply(
        `退室時刻を以下のように記録しました:\n ${dateTimeUTC
          .tz("Asia/Tokyo")
          .format("YYYY/MM/DD HH:mm:ss")}`,
      );
    } catch (e) {
      await interaction.editReply(`エラーが発生しました: ${e}`);
    }
  },
};

export default outCommand;
