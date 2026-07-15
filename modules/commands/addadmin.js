const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "addadmin",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Trịnh Đình Phát",
    description: "Add user to bot admin list",
    commandCategory: "Admin",
    usages: "addadmin @tag or reply",
    cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;
    const configPath = path.join(__dirname, "../../config.json");

    // Read current config
    var config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    var adminList = config.ADMINBOT || [];
    var botID = api.getCurrentUserID();

    // Only current admin or bot can use this command
    if (!adminList.includes(senderID) && senderID !== botID) {
        return api.sendMessage("You don't have permission to use this command!", threadID, messageID);
    }

    // Get ID of person to add
    var targetID = null;
    var targetName = null;

    if (messageReply) {
        targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
        targetName = mentions[targetID].replace("@", "");
    } else {
        return api.sendMessage("Please tag or reply the person to add as admin!", threadID, messageID);
    }

    // Check if already admin
    if (adminList.includes(targetID)) {
        return api.sendMessage("This person is already a bot admin!", threadID, messageID);
    }

    // Add to list
    adminList.push(targetID);
    config.ADMINBOT = adminList;

    // Save to file
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");

    // Update global
    global.config.ADMINBOT = adminList;

    // Get name of added person
    try {
        var userInfo = await api.getUserInfo(targetID);
        targetName = userInfo[targetID].name;
    } catch (e) { }

    return api.sendMessage("Added " + (targetName || targetID) + " to bot admin list!\nID: " + targetID, threadID, messageID);
};
