import { Events } from "discord.js";
import type { Event } from "../types";
import { buttonSubmitHandler } from "../utils/handler/buttonSubmit";
import { handleModalSubmit } from "../utils/handler/modalSubmit";

const interactionCreateEvent: Event<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  execute: async (interaction) => {
    // DMでのコマンド使用を禁止
    if (!interaction.guild) {
      if (
        interaction.isChatInputCommand() ||
        interaction.isButton() ||
        interaction.isModalSubmit()
      ) {
        await interaction.reply({
          content:
            "❌ **エラー** ❌\n```diff\n- このコマンドはiniad.tsサーバーの活動管理チャンネルで使用してください！\n```\n⚠️ DMでは使用できません ⚠️",
          ephemeral: true,
        });
      }
      return;
    }
    if (interaction.isModalSubmit()) await handleModalSubmit(interaction);
    if (interaction.isButton()) await buttonSubmitHandler(interaction);

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.error("No matching command found.");
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "An error occurred while executing your command.",
        ephemeral: true,
      });
    }
  },
};

export default interactionCreateEvent;
