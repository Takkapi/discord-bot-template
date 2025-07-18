A simple template for creating a Discord bot using [Discord.js](https://discord.js.org/) v14+ and Typescript with a database connection. 

---
## Table of Contents
- [Getting Started](#getting-started)
	- [Prerequisites](#prerequisites)
	- [Installation](#installation)
	- [Configuration](#configuration)

---
## Getting-Started
---
### Prerequisites
- Node.js version 22.12.0 or newer is required.
- A Discord bot (you can crate a Discord bot via the [Developer Portal](https://discord.com/developers/applications))
- A MongoDB database
---
### Installation
1. Clone the project:
```bash
git clone https://github.com/Takkapi/discord-bot-template.git
cd discord-bot-template
```
2. Install the dependencies:
```bash
npm install
```
3. Modify the `config.json` file in the `data` folder
```json
{
  "token": "YOUR-PRODUCTION-BOT-TOKEN",
  "discordClientId": "YOUR-PRODUCTION-BOT-CLIENT-ID",
  "mongoUrl": "YOUR-MONGODB-URL",

  "devToken": "YOUR-DEVELOPMENT-BOT-TOKEN",
  "devDiscordClientId": "YOUR-DEVELOPMENT-BOT-CLIENT-ID",
  "devGuildId": "YOUR-DEVELOPMENT-GUILD-ID",
  "developerUserIds": ["YOUR-USER-ID"],
  "devMongoUrl": "YOUR-DEVELOPMENT-MONGODB-URL"
}
```
All the fields dev related can be ignored if you only have one Discord bot
4. Start the bot:
```bash
npm run start
```

If everything goes right, you should see this output in your terminal
```output
Starting the bot in production mode.
Connected to MongoDB
Roky#3790 is now ready!
Successfully set 10 global application (/) commands!
Successfully set 2 dev application (/) commands!
```
---
### Configuration
#### Commands
The bot commands are in the `src/commands` directory where commands can and are separated in different folders.
```
📂 ./
├── ...
├── src/
│   ├── ...
│   ├── commands/
│   │   ├── admin/
│   │   ├── dev /
│   │   ├── moderation/
│   │   ├── utility /
│   │   ├── ...
│   ├── ...
│   ├── index.ts
├── ---
```
If you're using VS Code, I implemented a snippet for creating a command and subcommand faster without copy-pasting or rewriting the code over and over again. The `Test.ts`, `Test.One.ts`, `Test.Two.ts` serve as an example for creating subcommands and `Dev.ts` serve as an example for creating commands.
