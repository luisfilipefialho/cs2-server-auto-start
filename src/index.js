const { Client, Events, GatewayIntentBits } = require('discord.js');
const createCs2Watcher = require('./modules/cs2PresenceWatcher');
require('dotenv').config();

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildPresences
]});

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

createCs2Watcher(client, {
  guildId: process.env.DISCORD_GUILD_ID,
  userId: process.env.DISCORD_USER_ID,
  checkInterval: 5000,
  requiredTime: 20000,

  onStartPlaying: () => {
    console.log("Usuário começou a jogar CS2.");
  },

  onStopPlaying: () => {
    console.log("Usuário fechou o CS2.");
  },

  onStablePlaying: async () => {
    console.log("Usuário ficou 20s jogando CS2, executando funcao...");
  }
});

client.login(process.env.DISCORD_TOKEN);
