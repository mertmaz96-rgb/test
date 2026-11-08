import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('sunucu').setDescription('Sunucu bilgisini gösterir');

export async function execute(interaction) {
  const g = interaction.guild;
  await interaction.reply(`**${g.name}** — ${g.memberCount} üye`);
}
