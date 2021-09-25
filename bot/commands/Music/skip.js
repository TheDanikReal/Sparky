const Discord = require(`discord.js`);

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
  if (!message.member.voice.channel) {
    return message
      .reply(`${bot.config.Emojis.error} | You must be in a __**voice channel**__ to use this command!`)
      .then(m => m.delete({ timeout: 5000 }));
  }

  let queue = await bot.distube.getQueue(message);

  if (queue) {
    bot.distube.skip(message);

    message.reply({
      embed: {
        title: `${bot.config.Emojis.music} | Skipped Song`,
        description: `Skipped currently playing song.`,
        color: `#0099ff`,

        fields: [
          {
            name: `Skipped To`,
            value: queue.songs[0],
            inline: true,
          },
        ],

        thumbnail: {
          url: `https://www.notebookcheck.net/fileadmin/Notebooks/News/_nc3/YouTube.jpg`,
        },

        footer: {
          text: `Skipped song`,
          icon_url: bot.user.displayAvatarURL(),
        },
      },
    });
  }
}

module.exports = new cmd(execute, {
  description: `Skip to the next song in the queue.`,
  usage: "",
  aliases: ["unpause"],
  perms: ["EMBED_LINKS"],
});
