const Discord = require("discord.js")

exports.run = async (Bot) => {
  const Activities = [
    {
      text: `${process.env.prefix}Help`,
      type: "WATCHING",
      status: "online"
    },
  
    {
      text: `${await await Bot.FormatNumber(Bot.GetServerCount())} servers!`,
      type: "WATCHING",
      status: "online"
    },

    {
      text: `Ch1ll'n!`,
      type: "WATCHING",
      status: "online"
    },

    {
      text: `Watching ${await await Bot.FormatNumber(Bot.GetUserCount())} users!`,
      type: "WATCHING",
      status: "online"
    }
  ]

  Bot.setInterval(() => {
    const Activity = Activities[Math.floor(Math.random() * Activities.length)]

    Bot.user.setPresence({
      activity: {
        name: Activity.text,
        type: Activity.type
      },
      status: Activity.status
    })
  }, 60 * 1000)

  for (const guild of Bot.guilds.cache) {
    if (process.env.GuildBlacklist.includes(guild.id)) {
      try {
        await guild.leave()

        console.log(`SUCCESS - GUILD BLACKLIST => Left guild ${guild.name} because it's on the GuildBlacklist.`)
      } catch {
        console.log(`ERROR - GUILD BLACKLIST => Failed to leave Blacklisted guild! GuildName: ${guild.name} GuildID: ${id}`)
      }
    }
  }

  for (const guild of Bot.guilds.cache) {
    if (process.env.UserBlacklist.includes(guild.ownerID)) {
      try {
        await guild.leave()

        Bot.Log("SUCCESS", "USER BLACKLIST GUILD", `Left guild ${guild.name} (${guild.id}) because the owner is on the UserBlacklist.`)
      } catch {
        Bot.Log("ERROR", "USER BLACKLIST GUILD", `Failed to leave Blacklisted User's Guild! ${guild.name} (${id})`)
      }
    }
  }

  for (const guild of Bot.guilds.cache){
    Bot.UserCount = Bot.UserCount + guild.memberCount
  }

  Bot.user.setAvatar(process.env.AvatarURL)
  Bot.Log("BOT STATUS", Bot.user.tag, `Bot is now up and running!\nServers: ${await await Bot.FormatNumber(Bot.GetServerCount())}\nUsers: ${await await Bot.FormatNumber(Bot.GetUserCount())}`)
}
