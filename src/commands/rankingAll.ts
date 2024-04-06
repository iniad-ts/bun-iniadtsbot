import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import type { Command } from "../types";
import rankingUseCase from "../usecase/rankingUseCase";

const showCommand: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("ranking_all")
    .setDescription("滞在時間のランキングを表示します。(今学期の全期間)")
    .addBooleanOption((option) =>
      option
        .setName("showallmembers")
        .setDescription("全メンバーを表示する")
        .setRequired(false),
    ) as SlashCommandBuilder,
  execute: async (interaction) => {
    try {
      await interaction.deferReply();
      const showAllMembers = interaction.options.getBoolean("showallmembers");
      const rankingData = await rankingUseCase.ranking_all();

      if (showAllMembers) {
        const title = `滞在時間のランキング (${new Date().getFullYear()}/4~${
          new Date().getFullYear() + 1
        }/3)`;
        const message = rankingData
          .map((data) => {
            return `${data.user?.user_name} 滞在時間: ${data.stayTime}`;
          })
          .join("\n");
        await interaction.editReply(`# ${title}\n${message}`);
      } else {
        const embed = new EmbedBuilder()
          .setTitle(
            `滞在時間のランキング (${new Date().getFullYear()}/4~${
              new Date().getFullYear() + 1
            }/3)`,
          )
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
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: "エラーが発生しました。" });
    }
  },
};

export default showCommand;
