const Discord = require("discord.js");

exports.run = async (Bot, message, Arguments) => {
  if (!message.member.voice.channel){
    return message.channel.send("You must be in a __**voice channel**__ to use this command!")
  } 
  
  Bot.distube.play(message, Arguments.join(" "))
},

exports.config = {
  enabled: true,
  guild_only: true,
  aliases: ["p"],
  mod_only: false
},
    
exports.help = {
  name: "Play",
  description: "Plays a song with the given name or URL.",
  usage: "<song title or URL>",
  category: "🎵music🎵",
  cooldown: 3
}