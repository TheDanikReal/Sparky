const Discord = require("discord.js");

module.exports = async bot => {
  bot.MSToTime = ms => {
    let RoundNumber = ms > 0 ? Math.floor : Math.ceil;
    let Days = RoundNumber(ms / 86400000);
    let Hours = RoundNumber(ms / 3600000) % 24;
    let Mins = RoundNumber(ms / 60000) % 60;
    let Secs = RoundNumber(ms / 1000) % 60;

    var time = Days > 0 ? `${Days} Day${Days === 1 ? "" : "s"}, ` : "";
    time += Hours > 0 ? `${Hours} Hour${Hours === 1 ? "" : "s"}, ` : "";
    time += Mins > 0 ? `${Mins} Minute${Mins === 1 ? "" : "s"} & ` : "";
    time += Secs > 0 ? `${Secs} Second${Secs === 1 ? "" : "s"}.` : "0 Seconds.";

    return time;
  };

  bot.FormatNumber = Number => {
    if (typeof Number === "string") {
      Number = parseInt(Number);
    }

    const DecPlaces = Math.pow(10, 1);
    var Abbrev = ["k", "m", "g", "t", "p", "e"];

    for (var i = Abbrev.length - 1; i >= 0; i--) {
      var Size = Math.pow(10, (i + 1) * 3);

      if (Size <= Number) {
        Number = Math.round((Number * DecPlaces) / Size) / DecPlaces;

        if (Number === 1000 && i < Abbrev.length - 1) {
          Number = 1;
          i++;
        }

        Number += Abbrev[i];
        break;
      }
    }

    return Number;
  };

  bot.PromptMessage = async (message, author, reactions, seconds) => {
    seconds *= 1000;

    for (const Reaction of reactions) {
      await message.react(Reaction);
    }

    const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

    setTimeout(() => {
      if (message.deleted) {
        return;
      }

      message.reactions.removeAll();

      return false;
    }, seconds);

    return message
      .awaitReactions(filter, {
        max: 1,
        time: seconds,
      })
      .then(collected => collected.first() && collected.first().emoji.name);
  };

  bot.GetMember = async (message, args) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        member => member.user.username === args.slice(0).join(" ") || member.user.username === args[0],
      ) ||
      message.member;

    return member;
  };

  bot.isURL = string => {
    if (string.startsWith("discord.gg/") || string.endsWith("discord.gg/")) {
      return true;
    }

    let regexp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;

    if (regexp.test(string)) {
      return true;
    } else {
      return false;
    }
  };

  bot.GetUserFromMention = mention => {
    if (!mention) return;

    if (mention.startsWith("<@") && mention.endsWith(">")) {
      mention = mention.slice(2, -1);

      if (mention.startsWith("!")) {
        mention = mention.slice(1);
      }

      return bot.users.cache.get(mention);
    }
  };

  bot.GetServerCount = async () => {
    if (bot.config.bot.Sharding.ShardingEnabled === false) {
      return bot.guilds.cache.size;
    }

    const promises = [bot.shard.fetchClientValues("guilds.cache.size")];

    return Promise.all(promises).then(results => results.flat().reduce((acc, ServerCount) => acc + ServerCount, 0));
  };

  bot.GetUserCount = async () => {
    if (bot.config.bot.Sharding.ShardingEnabled === false) {
      var CollectedUsers = 0;

      bot.guilds.cache.map((server, id) => (CollectedUsers = server.memberCount + CollectedUsers));

      return CollectedUsers;
    }

    const promises = [bot.shard.broadcastEval("this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)")];

    return Promise.all(promises).then(results => results.flat().reduce((acc, MemberCount) => acc + MemberCount, 0));
  };

  bot.Debounce = (callback, wait, immediate) => {
    var timeout;

    return function() {
      var context = this,
        args = args;
      var later = function() {
        timeout = null;
        if (!immediate) callback.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) callback.apply(context, args);
    };
  };

  bot.IsAdmin = message => {
    if (message.author.id === bot.config.Owner.ID) {
      return true;
    } else {
      if (process.env.Admins.includes(message.author.id)) {
        return true;
      }

      return false;
    }
  };

  bot.wait = ms => new Promise(r => setTimeout(r, ms));

  bot.FormatDate = date => new Intl.DateTimeFormat("en-US").format(date);
};
