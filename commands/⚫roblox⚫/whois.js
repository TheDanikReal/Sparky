const Discord = require("discord.js");

exports.run = async (Bot, msg, Arguments, command) => {
  if (process.env.TestMode) {
    return
  }

  const noblox = require("noblox.js");

  try {
    const UserID = await noblox.getIdFromUsername(Arguments[0])

    await noblox.getPlayerInfo(UserID).then((PlayerInfo) => {
      const InfoEmbed = new Discord.MessageEmbed()
        .setTitle(`${PlayerInfo.username}'s Profile`)
        .addField(`**Status**`, PlayerInfo.status || "No status.")
        .addField(`**Account Age**`, PlayerInfo.age || "N/A")
        .addField(`Join Date`, PlayerInfo.joinDate || "N/A")
        .addField(`Description`, PlayerInfo.blurb || "N/A")
        .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${UserID}&width=420&height=420&format=png`)
        .setURL(`https://www.roblox.com/users/${UserID}/profile`)

        message.channel.send(InfoEmbed)
    })
  } catch (err){
    const ErrorEmbed = new Discord.MessageEmbed()
      .setTitle(`404 | User Not Found`)
      .setDescription("Uh oh! Looks like this user doesn't exist or roblox is down. Check, [Roblox Status](https://status.roblox.com/).")
      .setFooter(`404 | User not found. Check your spelling and enter the command again.`)
      .setThumbnail("https://media.discordapp.net/attachments/539579135786352652/641188940983959555/627171202464743434.png")
      .setTimestamp()

      message.channel.send(ErrorEmbed)
  }
},

  exports.config = {
    name: "🆕WhoIs",
    description: "Ch1llBlox will look up any user and return information on that user.",
    aliases: ["who"],
    usage: "<username>",
    category: "⚫roblox⚫",
    bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"],
    member_permissions: [],
    enabled: true,
    cooldown: 10
  }