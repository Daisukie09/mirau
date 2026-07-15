module.exports.config = {
    name: 'getid',
    version: '1.0.0',
    hasPermssion: 0,
    credits: "TDF-2803 | zL: 0878139888",
    description: 'Get user ID to add bot admin',
    commandCategory: 'Utility',
    usages: 'getid @tag or reply to a message',
    cooldowns: 2
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID, type, mentions, messageReply } = event;

    let targetID = null;
    let targetName = null;

    // If reply to a message
    if (type === "message_reply" && messageReply) {
        targetID = messageReply.senderID;
    }
    // If tag person
    else if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
        targetName = mentions[targetID].replace('@', '');
    }
    // Get own ID
    else {
        targetID = senderID;
    }

    try {
        const userInfo = await api.getUserInfo(targetID);
        const name = userInfo[targetID]?.name || targetName || "Unknown";

        const msg = `📋 ID INFORMATION
━━━━━━━━━━━━━━━━━━
👤 Name: ${name}
🆔 ID: ${targetID}
━━━━━━━━━━━━━━━━━━
💡 Copy the ID above to add to ADMINBOT in config.json`;

        return api.sendMessage(msg, threadID, messageID);
    } catch (error) {
        return api.sendMessage(`🆔 ID: ${targetID}`, threadID, messageID);
    }
};
