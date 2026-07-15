module.exports.config = {
	name: "getlink",
	version: "1.0.4",
	hasPermssion: 0,
	credits: "Mirai Team và bố khánh",
	description: "Get download URL from video, audio and image sent from group, or get Facebook link.",
	commandCategory: "Utility",
	usages: "getLink [fb]",
	cooldowns: 5,
};

module.exports.languages = {
	"vi": {
		"invaidFormat": "❌ The message you replied to must be an audio, video or picture",
		"fbLink": "🔗 Facebook link: "
	},
	"en": {
		"invaidFormat": "❌ Your need reply a message have contain an audio, video or picture",
		"fbLink": "🔗 Facebook link: "
	}
}

module.exports.run = async ({ api, event, args, getText }) => {
	const axios = require('axios');
	let fbLink = `https://www.facebook.com/profile.php?id=${event.senderID}`;

	// If argument is 'fb' then return Facebook link
	if (args[0] && args[0].toLowerCase() === "fb") {
		return api.sendMessage(fbLink, event.threadID, event.messageID);
	}

	// If it is a reply message
	if (event.type === "message_reply") {
		const uid = event.messageReply.senderID;
		fbLink = `https://www.facebook.com/profile.php?id=${uid}`;
		
		// Check attachments in the reply message
		if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
			return api.sendMessage(getText("invaidFormat"), event.threadID, event.messageID);
		}

		if (event.messageReply.attachments.length > 1) {
			return api.sendMessage(getText("invaidFormat"), event.threadID, event.messageID);
		}

		const attachment = event.messageReply.attachments[0];

		// Return attachment link if it is video, audio or photo
		if (["video", "audio", "photo"].includes(attachment.type)) {
			return api.sendMessage(attachment.url, event.threadID, event.messageID);
		}

		return api.sendMessage(getText("invaidFormat"), event.threadID, event.messageID);
	}

	// If no argument and not a reply message
	if (!args[0]) {
		return api.sendMessage(fbLink, event.threadID, event.messageID);
	} else {
		if (args[0].indexOf(".com/") !== -1) {
			const res_ID = await api.getUID(args[0]);
			return api.sendMessage(`${res_ID}`, event.threadID, event.messageID);
		} else {
			for (let mentionID of Object.keys(event.mentions)) {
				const mentionName = event.mentions[mentionID].replace('@', '');
				const profileLink = `https://www.facebook.com/profile.php?id=${mentionID}`;
				api.sendMessage(`${mentionName}\n→ Link: ${profileLink}`, event.threadID);
			}
			return;
		}
	}
}