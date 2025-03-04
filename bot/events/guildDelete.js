const Discord = require("discord.js");

module.exports = {
	once: false,
	async execute(bot, guild) {
		if (!guild.available) return;

		console.log(`SparkV has been removed from ${guild.name} (Id: ${guild.id}).`);

		bot.user.setPresence({
			status: "online",
			activities: [
				{
					name: `/help | ${bot.functions.formatNumber(await bot.functions.GetServerCount())} servers`,
					type: "PLAYING"
				}
			]
		});

		const Logger = bot.channels.cache.get("831314946624454656");
		const Owner = await guild?.fetchOwner().catch(err => null) || null;

		if (Logger) {
			const ServerRemovedEmbed = new Discord.MessageEmbed()
				.setTitle(`${bot.config.emojis.arrows.down}︱Guild Removed`)
				.setDescription(`SparkV left **${guild.name} (${guild.id})**.`)
				.addField(`${bot.config.emojis.player} **Members**`, `${bot.functions.formatNumber(guild.memberCount)}`, true)
				.addField("📅 **Created**", `<t:${~~(guild.createdAt / 1000)}:R>`, true)
				.setThumbnail(guild.iconURL())
				.setImage(guild.bannerURL())
				.setColor("RED");

			if (guild.vanityURLCode) {
				ServerRemovedEmbed
					.setURL(`https://discord.gg/${guild.vanityURLCode}`)
					.addField("🔗 **Vanity URL**", `https://discord.gg/${guild.vanityURLCode}`, true);
			}

			if (Owner) {
				ServerRemovedEmbed.setAuthor({
					name: Owner?.user?.username,
					iconURL: Owner?.user?.displayAvatarURL({ dynamic: true })
				});
			}

			Logger.send({
				embeds: [ServerRemovedEmbed]
			});
		}
	}
};
