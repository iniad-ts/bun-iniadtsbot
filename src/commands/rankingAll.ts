import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../types";
import officeAccessUseCase from "../usecase/officeAccessUseCase";

const showCommand: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("ranking_all")
    .setDescription(
      "滞在時間のランキングを表示します。(全期間)",
    ) as SlashCommandBuilder,
  execute: async (interaction) => {
    try {
      await interaction.deferReply();
      const rankingData = await officeAccessUseCase.ranking_all();

      const embed = new EmbedBuilder()
        .setTitle("入室中のユーザー")
        .setColor("#0099ff");
      const top25RankingData = rankingData.slice(0, 25);

      const embedFields = top25RankingData.map((data, index) => {
        return {
          name: `${index + 1}位: ${data.user?.user_name}`,
          value: `滞在時間: ${data.stayTime}`,
        };
      });

      for (const field of embedFields) {
        embed.addFields(field);
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: "エラーが発生しました。" });
    }
  },
};

export default showCommand;
