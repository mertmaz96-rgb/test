import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';

const body = [];
for (const file of readdirSync(new URL('./commands/', import.meta.url)).filter((f) => f.endsWith('.js'))) {
  body.push((await import(`./commands/${file}`)).data.toJSON());
}
const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
const rest = new REST().setToken(DISCORD_TOKEN);
const route = GUILD_ID ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID) : Routes.applicationCommands(CLIENT_ID);
await rest.put(route, { body });
console.log(`${body.length} komut kaydedildi.`);
