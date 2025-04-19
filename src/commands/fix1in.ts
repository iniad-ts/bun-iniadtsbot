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

const fix2inCommand: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("fix1in")
    .setDescription(
      "1食用の修正コマンドです",
    ) as SlashCommandBuilder,
  execute: async (interaction) => {
    const now = dayjs().tz("Asia/Tokyo");
    const modal = new ModalBuilder()
      .setCustomId("checkIn1fModal")
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

export default fix2inCommand;
