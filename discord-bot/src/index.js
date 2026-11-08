import 'dotenv/config';
import { Client, Collection, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import { readdirSync } from 'node:fs';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.commands = new Collection();

for (const file of readdirSync(new URL('./commands/', import.meta.url)).filter((f) => f.endsWith('.js'))) {
  const cmd = await import(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
}

client.once(Events.ClientReady, (c) => console.log(`Giriş yapıldı: ${c.user.tag}`));

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute(interaction);
  } catch (err) {
    console.error(err);
    const msg = { content: 'Bir hata oluştu.', flags: MessageFlags.Ephemeral };
    if (interaction.replied || interaction.deferred) await interaction.followUp(msg);
    else await interaction.reply(msg);
  }
});

client.on(Events.GuildMemberAdd, async (member) => {
  const id = process.env.WELCOME_CHANNEL_ID;
  if (!id) return;
  const ch = await member.guild.channels.fetch(id).catch(() => null);
  ch?.send(`Hoş geldin ${member}! 🎉`);
});

process.on('unhandledRejection', (e) => console.error(e));
client.login(process.env.DISCORD_TOKEN);
