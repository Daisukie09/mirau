const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "deleteadmin",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Trịnh Đình Phát",
    description: "Remove user from bot admin list",
    commandCategory: "Admin",
    usages: "deleteadmin @tag or reply",
    cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;
    const configPath = path.join(__dirname, "../../config.json");

    // Read current config
    var config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    var adminList = config.ADMINBOT || [];
    var botID = api.getCurrentUserID();

    // Only bot ID (highest permission) can remove other admins
    // Or first admin in list (owner)
    var ownerID = adminList[0];

    if (senderID !== botID && senderID !== ownerID) {
        return api.sendMessage("Only bot owner can remove admin!", threadID, messageID);
    }

    // Get ID of person to remove
    var targetID = null;
    var targetName = null;

    if (messageReply) {
        targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
        targetName = mentions[targetID].replace("@", "");
    } else {
        return api.sendMessage("Please tag or reply the person to remove admin!", threadID, messageID);
    }

    // Cannot remove bot ID
    if (targetID === botID) {
        return api.sendMessage("Cannot remove bot's admin rights!", threadID, messageID);
    }

    // Cannot remove owner (first admin)
    if (targetID === ownerID && senderID !== botID) {
        return api.sendMessage("Cannot remove bot owner!", threadID, messageID);
    }

    // Check if person is admin
    if (!adminList.includes(targetID)) {
        return api.sendMessage("This person is not a bot admin!", threadID, messageID);
    }

    // Remove from list
    var index = adminList.indexOf(targetID);
    adminList.splice(index, 1);
    config.ADMINBOT = adminList;

    // Save to file
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");

    // Update global
    global.config.ADMINBOT = adminList;

    // Get name of removed person
    try {
        var userInfo = await api.getUserInfo(targetID);
        targetName = userInfo[targetID].name;
    } catch (e) { }

    return api.sendMessage("Removed " + (targetName || targetID) + " from bot admin list!\nID: " + targetID, threadID, messageID);
};
