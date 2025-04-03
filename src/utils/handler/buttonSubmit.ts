import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
} from "discord.js";
import generateShowMessage from "../generateShowMessage";

const handleShowRefreshButtonSubmit = async (
  interaction: ButtonInteraction,
) => {
  try {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("refresh")
        .setLabel("更新")
        .setStyle(ButtonStyle.Primary),
    );

    if (!interaction.channel) {
      console.log("Channel is not available.");
      return;
    }
    await interaction.update({
      content: await generateShowMessage(),
      components: [row],
    });
  } catch (error) {
    console.error(error);
    await interaction.update({ content: "エラーが発生しました。" });
  }
};

export const buttonSubmitHandler = (interaction: ButtonInteraction) => {
  if (interaction.customId === "refresh") {
    handleShowRefreshButtonSubmit(interaction);
  }
};
