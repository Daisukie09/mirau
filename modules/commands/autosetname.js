const { join } = require("path");
const { existsSync, writeFileSync, readFileSync } = require("fs-extra");
const moment = require('moment-timezone');

module.exports.config = {
    name: "autosetname",
    version: "1.0.1",
    hasPermssion: 1,
    credits: "Niiozic",
    description: "Auto set name for new members",
    commandCategory: "Group Admin",
    usages: "[add <name> /remove]",
    cooldowns: 5
}

module.exports.onLoad = () => {
    const pathData = join(__dirname, "data", "autosetname.json");
    if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8");
}

module.exports.run = async function ({ event, api, args, permssion, Users }) {
    const { threadID, messageID, senderID } = event;
    const pathData = join(__dirname, "data", "autosetname.json");
    const content = (args.slice(1)).join(" ");
    var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };

    switch (args[0]) {
        case "add": {
            if (content.length == 0) return api.sendMessage("⚠️ New member name configuration cannot be empty!", threadID, messageID);
            if (thisThread.nameUser.length > 0) return api.sendMessage("⚠️ Please remove the old name configuration before setting a new one!", threadID, messageID);
            thisThread.nameUser.push(content);
            writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
            api.sendMessage(`✅ New member name configuration set successfully\n📝 Preview: ${
                content
                    .replace(/{name}/g, global.data.userName.get(senderID) || "User")
                    .replace(/{time}/g, moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss | DD/MM/YYYY'))
            }`, threadID, messageID);
            break;
        }
        case "rm":
        case "remove":
        case "delete": {
            if (thisThread.nameUser.length == 0) return api.sendMessage("❎ Your group hasn't set a new member name configuration!", threadID, messageID);
            thisThread.nameUser = [];
            api.sendMessage(`✅ Successfully deleted the new member name configuration`, threadID, messageID);
            break;
        }
        default: {
            return api.sendMessage(`📝 Use: autosetname add TVM {name} {time} to configure nickname for new members\n✏️ Use: autosetname remove to delete the nickname configuration for new members\n{name} -> gets user name\n{time} -> time joined group`, threadID, messageID);
        }
    }
    if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
    return writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
}