const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
	const pages = [];

	bot.shop.each(item => {
		const itemEmbed = new Discord.MessageEmbed()
			.setTitle(`Shop - ${item.name}`)
			.setDescription(item.desc || "Well that's odd... this item doesn't have a description.")
			.addField(`IDs`, item.ids.join(", "), true)
			.addField("Price", item.sale ? `⏣ ${item.price}` : `This item isn't for sale.`, true)
			.setColor("BLUE")
			.setTimestamp();

		pages.push(itemEmbed);
	});

	const quickLeft = new Discord.MessageButton()
		.setEmoji("⬅️")
		.setCustomId("quickLeft")
		.setStyle("PRIMARY");

	const left = new Discord.MessageButton()
		.setEmoji("◀️")
		.setCustomId("left")
		.setStyle("PRIMARY");

	const number = new Discord.MessageButton()
		.setEmoji("#️⃣")
		.setCustomId("number")
		.setStyle("PRIMARY");

	const right = new Discord.MessageButton()
		.setEmoji("▶️")
		.setCustomId("right")
		.setStyle("PRIMARY");

	const quickRight = new Discord.MessageButton()
		.setEmoji("➡️")
		.setCustomId("quickRight")
		.setStyle("PRIMARY");

	let PageNumber = 0;
	const msg = await message.replyT({
		embeds: [pages[0]],
		components: [new Discord.MessageActionRow().addComponents(quickLeft, left, number, right, quickRight)],
		fetchReply: true
	});

	const collector = msg.createMessageComponentCollector({
		filter: interaction => {
			if (!interaction.deferred) interaction.deferUpdate();

			return true;
		}, time: 300 * 1000
	});

	collector.on("collect", async interaction => {
		if (interaction.customId === "quickLeft") {
			PageNumber = 0;
		} else if (interaction.customId === "left") {
			if (PageNumber > 0) {
				--PageNumber;
			} else {
				PageNumber = pages.length - 1;
			}
		} else if (interaction.customId === "right") {
			if (PageNumber + 1 < pages.length) {
				++PageNumber;
			} else {
				PageNumber = 0;
			}
		} else if (interaction.customId === "quickRight") {
			PageNumber = pages.length - 1;
		} else if (interaction.customId === "number") {
			const infoMsg = await interaction.replyT("Please send a page number.");

			await interaction.channel.awaitMessages({
				filter: msg => {
					if (msg.author.id === msg.client.user.id) return false;

					if (!msg.content) {
						msg.replyT("Please send a number!");

						return false;
					}

					if (!parseInt(msg.content) && isNaN(msg.content)) {
						msg.replyT("Please send a valid number!");

						return false;
					}

					if (parseInt(msg.content) > pages.length) {
						msg.replyT("That's a page number higher than the amount of pages there are.");

						return false;
					}

					return true;
				}, max: 1, time: 30 * 1000, errors: ["time"]
			}).then(async collected => {
				const input = parseInt(collected.first().content);

				PageNumber = input - 1;
				collected.first().delete().catch(err => { });
				infoMsg.delete().catch(err => { });
			}).catch(async collected => await interaction.replyT("Canceled due to no valid response within 30 seconds."));
		} else {
			return;
		}

		try {
			interaction.edit({
				embeds: [
					pages[PageNumber].setFooter({
						text: `${bot.config.embed.footer} • Page ${PageNumber + 1}/${pages.length}`
					})
				],
			});
		} catch (err) {
			// Page deleted.
		}
	});

	collector.on("end", async () => {
		try {
			await msg?.edit({
				components: []
			});
		} catch (err) {
			// Do nothing. This is just to stop errors from going into the console. It's mostly for the case where the message is deleted.
		}
	});
}

module.exports = new cmd(execute, {
	description: `Displays the shop!`,
	dirname: __dirname,
	usage: "",
	aliases: [],
	perms: [],
	slash: true
});
