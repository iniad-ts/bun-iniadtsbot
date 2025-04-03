import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import type { Command } from "../types";
import generateShowMessage from "../utils/generateShowMessage";

const showCommand: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("show")
    .setDescription("入室中のユーザーを表示します。") as SlashCommandBuilder,
  execute: async (interaction) => {
    await interaction.deferReply();

    // ボタンの設定
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("refresh")
        .setLabel("更新")
        .setStyle(ButtonStyle.Primary),
    );

    if (!interaction.channel) {
      console.log("Channel is not available.");
      await interaction.editReply(
        "適切なチャンネルが見つかりませんでした。\n処理を中断します。",
      );
      return;
    }

    // 組み立てたメッセージとボタンを含むリプライを送信
    await interaction.editReply({
      content: await generateShowMessage(),
      components: [row],
    });
  },
};

export default showCommand;
