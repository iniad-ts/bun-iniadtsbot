import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { Command } from "../types";
import officeAccessUseCase from "../usecase/officeAccessUseCase";
import { roleManage } from "../utils/roleManage";
import updatePresence from "../utils/updatePresence";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const inCommand: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("in")
    .setDescription("入室用のコマンドです。") as SlashCommandBuilder,
  execute: async (interaction) => {
    const dateTimeUTC = dayjs().utc();
    try {
      await interaction.deferReply();
      await officeAccessUseCase.checkIn(
        BigInt(interaction.user.id),
        dateTimeUTC.toDate(),
        interaction.user.username,
      );
      await roleManage.addRole(interaction);
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
