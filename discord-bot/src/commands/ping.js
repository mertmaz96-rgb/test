import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Botun gecikmesini gösterir');

export async function execute(interaction) {
  await interaction.reply(`🏓 Pong! ${Math.round(interaction.client.ws.ping)}ms`);
}
