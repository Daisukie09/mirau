const axios = require("axios");

module.exports.config = {
	name: "anya",
	version: "1.2",
	hasPermssion: 0,
	credits: "Xemon",
	description: "Chat with Anya AI",
	commandCategory: "funny",
	usages: "on — Toggle auto-reply\n  off — Disable auto-reply\n  <text> — Quick chat",
	cooldowns: 15,
	dependencies: {
		"axios": ""
	}
};

async function getMessage(yourMessage) {
	const res = await axios.post(
		'https://api.simsimi.vn/v1/simtalk',
		new URLSearchParams({ text: yourMessage, lc: 'en' })
	);
	if (res.status > 200) throw new Error(res.data.success);
	return res.data.message;
}

module.exports.run = async function ({ api, event, args, Threads }) {
	const { threadID, messageID } = event;

	if (args[0] === 'on' || args[0] === 'off') {
		try {
			const threadData = await Threads.getData(threadID);
			const data = threadData.data || {};
			data.simsimi = args[0] === 'on';
			await Threads.setData(threadID, { data });
			const reply = args[0] === 'on' ? '✅ Turned on Anya successfully!' : '✅ Turned off Anya successfully!';
			return api.sendMessage(reply, threadID, messageID);
		} catch (e) {
			return api.sendMessage('Error toggling Anya.', threadID, messageID);
		}
	}

	if (args.length > 0) {
		const yourMessage = args.join(" ");
		try {
			const responseMessage = await getMessage(yourMessage);
			return api.sendMessage(responseMessage, threadID, messageID);
		} catch (err) {
			return api.sendMessage("What?🙂", threadID, messageID);
		}
	}

	return api.sendMessage("Usage: anya on | off | <text>", threadID, messageID);
};

module.exports.handleEvent = async function ({ api, event, Threads }) {
	const { threadID, messageID, senderID, body } = event;
	if (!body || senderID === api.getCurrentUserID()) return;
	if (body.startsWith('/')) return;

	try {
		const threadData = await Threads.getData(threadID);
		const data = threadData.data || {};
		if (!data.simsimi) return;

		const responseMessage = await getMessage(body);
		api.sendMessage(responseMessage, threadID, messageID);
	} catch (e) {}
};
