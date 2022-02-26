const Discord = require("discord.js");
const RandomWord = require("random-words");

const cmd = require("../../templates/gameCommand");

async function execute(bot, message) {
	const word = RandomWord();
	const lettersRegExp = new RegExp(`^[A-Za-zÀ-ú](?:.{0}|.{${word.length - 1}})$`);

	let menuEmbed;

	let gameOver = false;
	let gameStatus = "playing";

	let progress = "_".repeat(word.length);
	let lives = 6;
	let remaining = word.length;
	const misses = [];

	console.log(word, progress);

	async function updateGame() {
		const embed = new Discord.MessageEmbed()
			.setAuthor({
				name: (message.user ? message.user : message.author).tag,
				iconURL: (message.user ? message.user : message.author).displayAvatarURL({ dynamic: true })
			})
			.setTitle("Hangman")
			.setDescription(`\`\`\`
        +--+
        |  |
        |  ${lives < 6 ? "0" : " "}
        | ${lives < 3 ? "/" : " "}${lives < 5 ? "|" : " "}${lives < 4 ? "\\" : " "}
        | ${lives < 2 ? "/" : " "} ${lives < 1 ? "\\" : " "}
        |
    ---------
        \`\`\`\n${gameOver ? `${(gameStatus === "won" ? "You won!" : "You lost. Better luck next time.")} The word was \`${word}\`` : "You got this!"}`)
			.addField("Word", `\`${progress}\``, false)
			.addField("Guesses", `${misses.join(", ") || "None."}`, true)
			.addField("Lives", `${"❤️".repeat(lives >= 0 ? lives : 0)}${"🖤".repeat(6 - lives)}`, true)
			.setColor(gameOver ? (gameStatus === "won" ? "GREEN" : "RED") : "BLUE");

		if (menuEmbed) {
			await menuEmbed.edit({
				embeds: [embed]
			});
		} else {
			menuEmbed = await message.replyT({
				embeds: [embed]
			});
		}
	}

	await updateGame();

	const collector = await menuEmbed.channel.createMessageCollector({
		filter: m => m.content,
		time: 900 * 1000,
		errors: ["time"],
	});

	collector.on("collect", async m => {
		if (m.content.toLowerCase() === "cancel") await collector.stop();
		if (!m.content.match(lettersRegExp)) return;

		const guess = m.content.toLowerCase();

		if (guess.length === 1) {
			if (misses[`\`${guess}\``]) {
				await m.replyT(`${guess} has already been guessed.`).then(async m => setTimeout(() => m.delete(), 5000));
			} else if (word.includes(guess)) {
				for (let i = 0; i < word.length; ++i) {
					if (word[i] === guess) {
						progress = `${progress.substring(0, i)}${word[i]}${progress.substring(i + word[i].length)}`;
						remaining--;
					}
				}
			} else {
				if (!misses.includes(guess)) misses.push(`\`${guess}\``);
				lives--;
			}

			if (lives === 0) {
				gameStatus = "lost";
			} else if (remaining === 0) {
				gameStatus = "won";
			}

			m.delete();
		}

		await updateGame();

		if (gameStatus !== "playing") {
			await collector.stop();
		}
	});

	collector.on("end", async collected => {
		gameOver = true;
		await updateGame();
	});
}

module.exports = new cmd(execute, {
	description: "Challenge your friends to a game of hangman!",
	usage: "",
	dirname: __dirname,
	aliases: [],
	perms: [],
	type: "normal",
	slash: true,
});
