import dayjs from "dayjs";
import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import type { Command } from "../types";
("../types");

const inCommand: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("fixin")
    .setDescription(
      "指定した時間で入室します。\n入室を忘れた場合に使用してください。",
    ) as SlashCommandBuilder,
  execute: async (interaction) => {
    const now = dayjs().tz("Asia/Tokyo");
    const modal = new ModalBuilder()
      .setCustomId("checkInModal")
      .setTitle("入室時間の入力");

    // 日付入力フィールド
    const dateInput = new TextInputBuilder()
      .setCustomId("date")
      .setLabel("YYYY/MM/DD形式で日付を入力してください。")
      .setStyle(TextInputStyle.Short)
      .setValue(now.format("YYYY/MM/DD"))
      .setMaxLength(10);

    // 時間入力フィールド
    const timeInput = new TextInputBuilder()
      .setCustomId("time")
      .setLabel("HH:mm形式で時間を入力してください。")
      .setStyle(TextInputStyle.Short)
      .setValue(now.format("HH:mm"));

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(dateInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(timeInput),
    );

    await interaction.showModal(modal);
  },
};

export default inCommand;
