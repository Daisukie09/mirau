const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
	name: "anya2",
	version: "2.0",
	hasPermssion: 0,
	credits: "kshitiz",
	description: "Japanese Anya text to speech",
	commandCategory: "AI",
	usages: "[text]",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs": "",
		"path": ""
	}
};

module.exports.run = async function ({ api, event, args }) {
	const { messageID, threadID, senderID } = event;
	const { createReadStream, unlinkSync } = fs;
	const { resolve } = path;
	const name = "Anya";
	const ranGreet = ["Konichiwa " + name, "Konichiwa senpai", "Hora"][Math.floor(Math.random() * 3)];

	if (!args[0]) return api.sendMessage(ranGreet, threadID, messageID);

	const chat = args.join(" ");
	const simRes = " " + chat;
	const text = encodeURIComponent(simRes);
	const audioPath = resolve(__dirname, 'cache', `${threadID}_${senderID}.wav`);

	try {
		const audioApi = await axios.get(`https://api.tts.quest/v3/voicevox/synthesis?text=${text}&speaker=3`);
		const audioUrl = audioApi.data.mp3StreamingUrl;

		const response = await axios({ method: 'get', url: audioUrl, responseType: 'stream' });
		const writer = fs.createWriteStream(audioPath);
		response.data.pipe(writer);
		await new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
		});

		const att = createReadStream(audioPath);
		api.sendMessage({ body: simRes, attachment: att }, threadID, () => unlinkSync(audioPath), messageID);
	} catch (error) {
		console.error(error);
		api.sendMessage("error", threadID, messageID);
	}
};
