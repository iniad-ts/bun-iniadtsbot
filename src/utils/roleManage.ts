import type { Interaction } from "discord.js";

export const roleManage = {
  addRole: async (interaction: Interaction) => {
    const nowOfficeInRole = interaction.guild?.roles.cache.find(
      (role) => role.name === "オフィス活動中",
    );
    if (nowOfficeInRole) {
      const member = interaction.guild?.members.cache.get(interaction.user.id);
      await member?.roles.add(nowOfficeInRole);
    }
  },
  removeRole: async (interaction: Interaction) => {
    const nowOfficeInRole = interaction.guild?.roles.cache.find(
      (role) => role.name === "オフィス活動中",
    );
    if (nowOfficeInRole) {
      const member = interaction.guild?.members.cache.get(interaction.user.id);
      await member?.roles.remove(nowOfficeInRole);
    }
  },
};
