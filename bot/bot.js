// KingCh1ll //
// Last Edited: 2/25/2021 //
// Index.js //

// Run Client Extender
require("./structures/extenders");

// Librarys //
const fs = require("fs");
const path = require("path");
const Statcord = require("statcord.js");
const { Collection, Intents, Permissions, Options } = require("discord.js");

const Client = require("./structures/client");
const SparkV = new Client({
	intents: [
		Intents.FLAGS.DIRECT_MESSAGES,
		// Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		// Intents.FLAGS.DIRECT_MESSAGE_TYPING
		Intents.FLAGS.GUILDS,
		// Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_BANS,
		// Intents.FLAGS.GUILD_WEBHOOKS,
		// Intents.FLAGS.GUILD_INTEGRATIONS,
		// Intents.FLAGS.GUILD_INVITES,
		// Intents.FLAGS.GUILD_PRESENCES,
		// Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		// Intents.FLAGS.GUILD_MESSAGE_TYPING,
	],
	partials: ["MESSAGE", "REACTION"],
	presence: {
		activity: {
			name: `Loading SparkV (99%)`,
			type: "PLAYING",
		},
		status: "dnd",
	}
});
global.bot = SparkV;

async function Start() {
	await SparkV.LoadModules({
		sharding: process.execArgv.includes("--sharding")
	});

	await SparkV.LoadEvents(__dirname);
	await SparkV.LoadCommands(__dirname);
}

Start();
SparkV.login(process.env.TOKEN);
