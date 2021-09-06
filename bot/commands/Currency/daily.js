const Discord = require("discord.js");

const cmd = require("../../templates/command");

async function execute(bot, message, args, command, data) {
  const RandomAmmount = Math.floor(Math.random() * 3500) + 1;

  var Ch1llBucks = data.user.money.balance;
  var Multiplier = data.user.money.multiplier;

  const Ammount = RandomAmmount * Multiplier;

  data.user.money.balance = Ch1llBucks + Ammount;
  await data.user.save();

  message.reply(
    `${bot.config.bot.Emojis.success} | You've just earned ❄${await bot.functions.FormatNumber(Ammount)} Ch1llBucks!`,
  );
}

module.exports = new cmd(execute, {
  description: "Collect your daily ammount of Ch1llBucks!",
  dirname: __dirname,
  usage: ``,
  aliases: [],
  perms: ["EMBED_LINKS"],
  cooldown: 6000,
});
