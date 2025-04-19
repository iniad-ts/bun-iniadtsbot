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
  addRole1: async (interaction: Interaction) => {
    const nowOfficeInRole = interaction.guild?.roles.cache.find(
      (role) => role.name === "1食活動中",
    );
    if (nowOfficeInRole) {
      const member = interaction.guild?.members.cache.get(interaction.user.id);
      await member?.roles.add(nowOfficeInRole);
    }
  },
  addRole2: async (interaction: Interaction) => {
    const nowOfficeInRole = interaction.guild?.roles.cache.find(
      (role) => role.name === "2食活動中",
    );
    if (nowOfficeInRole) {
      const member = interaction.guild?.members.cache.get(interaction.user.id);
      await member?.roles.add(nowOfficeInRole);
    }
  },
  removeRole: async (interaction: Interaction) => {
    const officeRoles = interaction.guild?.roles.cache.filter(
      (role) => role.name === "オフィス活動中" || role.name === "1食活動中" || role.name === "2食活動中",
    );

    if (officeRoles && officeRoles.size > 0) {
      const member = interaction.guild?.members.cache.get(interaction.user.id);
      await member?.roles.remove(officeRoles);
    }
  },
};
