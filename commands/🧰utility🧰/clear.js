const Discord = require("discord.js");

exports.run = async (Bot, msg, Arguments) => {
  if (msg.deletable){
    msg.delete()
  }
  
  if (!msg.member.hasPermission("MANAGE_MESSAGES")){
    return msg.channel.send("You don't have permision to run this command!").then(m => m.delete(500))
  }

  if (isNaN(Arguments[0]) || parseInt(Arguments[0]) <= 0){
    return msg.channel.send("That's not a nunber lol.")
  }
  
  let DeleteAmount
  
  if (parseInt(Arguments[0]) > 100){
    DeleteAmount = 100
  } else {
    DeleteAmount = parseInt(Arguments[0])
  }

  msg.channel
    .bulkDelete(DeleteAmount, true)
    .then(() => {
      msg.channel.send(`Successfully deleted ${DeleteAmount} messages.`).then(m => m.delete(500))
    })
    .catch(() => msg.channel.send(`Uh oh... I couldn't delete these messages!`));
},

exports.config = {
    enabled: true,
    guild_only: true,
    aliases: ["purge", "clr"],
    mod_only: false
  },
  
exports.help = {
    name: "Clear",
    description:
      "I can delete messages for you so you don't have to spend a while deleting them :)",
    usage: "[how many messages to delete]",
    category: "🧰utility🧰",
    cooldown: 3.5
  }