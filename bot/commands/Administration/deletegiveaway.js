const Discord = require(`discord.js`);

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
  const ID = args[0];

  if (!ID || isNaN(ID)) {
    return message.reply(`${bot.config.Emojis.error} | Please provide a valid message ID.`);
  }

  const Giveaway = bot.GiveawayManager.giveaways.find(giveaway => giveaway.messageID === args[0]);

  if (!Giveaway) {
    return message.reply(`I couldn't find a giveaway with that message ID.`);
  }

  bot.GiveawayManager.delete(Giveaway.messageID)
    .then(() => {
      message.reply(`Giveaway successfully deleted!`);
    })
    .catch(err => {
      console.error(err).then(() => {
        message.reply(`An error occured with SparkV! Please try this command again.`);
      });
    });
}

module.exports = new cmd(execute, {
  description: `Delete a giveaway. Requires the permision MANAGE_MESSAGES.`,
  dirname: __dirname,
  usage: "",
  aliases: ["deleteg"],
  perms: ["EMBED_LINKS", "MANAGE_MESSAGES"],
  gname: "youtube",
  type: "together",
});
