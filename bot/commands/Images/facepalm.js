const Discord = require("discord.js");

const cmd = require("../../templates/imageCommand");

module.exports = new cmd({
	description: "bruh",
	dirname: __dirname,
	aliases: [],
	usage: `(user: optional default: you)`,
	effect: "facepalm",
});
