# Discord Bot

## Kurulum (sunucuda)
1. https://discord.com/developers/applications → New Application → Bot → token al. "Server Members Intent"i aç.
2. OAuth2 → URL Generator: scope `bot` + `applications.commands`, ile botu sunucuna davet et.
3. Sunucuda (Node 18+):
```bash
git clone <repo> && cd <repo>/discord-bot
cp .env.example .env   # DISCORD_TOKEN ve CLIENT_ID doldur
npm install
npm run deploy-commands
npm install -g pm2 && pm2 start src/index.js --name discord-bot && pm2 save && pm2 startup
```
Güncelleme: `git pull && npm install && pm2 restart discord-bot`
