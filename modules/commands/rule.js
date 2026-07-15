module.exports.config = {
    name: "rule",
    version: "1.0.5",
    hasPermssion: 0,
    credits: "CatalizCS,Dgk",
    description: "Customize rules for each group and manage members",
    commandCategory: "User",
    usages: "[add/remove/all] [content/ID]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
}


function getCurrentDateTime() {
    const date = new Date();
    const options = { timeZone: "Asia/Ho_Chi_Minh", hour12: false };
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", options);
    return `${day}/${month}/${year} ${time}`;
}

// Usage instructions
const usageInstructions = () => {
    return `🎉 Rule module usage instructions 🎉\n\n` +
           `-📝 Add rule: \n` +
           `  \`!rule add [rule content]\` - Add a new rule to the group.\n\n` +
           `-✒ Rule list: \n` +
           `  \`!rule list\` or \`!rule all\` - Display the current rule list of the group.\n\n` +
           `- 💔 Delete rule: \n` +
           `  \`!rule remove [number]\` - Delete a rule by number.\n` +
           `  \`!rule remove all\` - Delete all rules in the group.\n\n` +
           `🔏 Note: Only users with sufficient permissions can add or delete rules.`;
};

module.exports.onLoad = () => {
    const { existsSync, writeFileSync } = require("fs-extra");
    const { join } = require("path");
    const pathData = join(__dirname, "data", "rule.json");
    if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8");
}

module.exports.run = ({ event, api, args, permssion }) => {
    const { threadID, messageID, senderID } = event;
    const { readFileSync, writeFileSync } = require("fs-extra");
    const { join } = require("path");
    const pathData = join(__dirname, "data", "rule.json");
    const content = (args.slice(1, args.length)).join(" ");
    var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, listRule: [] };

 
    const currentDateTime = getCurrentDateTime();

    api.getUserInfo(senderID, (err, result) => {
        if (err) return console.error(err);
        const userName = result[senderID].name;

        switch (args[0]) {
            case "add": {
                if (permssion == 0) return api.sendMessage("❎ You do not have enough permissions to add rules!", threadID, messageID);
                if (content.length == 0) return api.sendMessage("⚠️ Content cannot be empty", threadID, messageID);

                if (content.indexOf("\n") != -1) {
                    const contentSplit = content.split("\n");
                    for (const item of contentSplit) thisThread.listRule.push(item);
                } else {
                    thisThread.listRule.push(content);
                }

                writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
                api.sendMessage({
                    body: `✅ Successfully added new rule to the group by ${userName}!\n🕒 ${currentDateTime}`,
                    mentions: [{ tag: userName, id: senderID }]
                }, threadID, messageID);
                break;
            }
            case "list":
            case "all": {
                var msg = "", index = 0;
                for (const item of thisThread.listRule) msg += `${index += 1}. ${item}\n`;
                if (msg.length == 0) return api.sendMessage("⚠️ Your group currently has no rules to display!", threadID, messageID);
                api.sendMessage(`[ GROUP RULES - UPDATED by ${userName} ]\n\n${msg}\n🕒 ${currentDateTime}`, threadID, messageID);
                break;
            }
            case "rm":
            case "remove":
            case "del": {
                if (!isNaN(content) && content > 0) {
                    if (permssion == 0) return api.sendMessage("❎ You do not have enough permissions to delete rules!", threadID, messageID);
                    if (thisThread.listRule.length == 0) return api.sendMessage("⚠️ Your group has no rules to delete!", threadID, messageID);
                    thisThread.listRule.splice(content - 1, 1);
                    api.sendMessage(`✅ Successfully deleted rule number ${content} by ${userName}\n🕒 ${currentDateTime}`, threadID, messageID);
                    break;
                } else if (content == "all") {
                    if (permssion == 0) return api.sendMessage("❎ You do not have enough permissions to delete rules!", threadID, messageID);
                    if (thisThread.listRule.length == 0) return api.sendMessage("⚠️ Your group has no rules to delete!", threadID, messageID);
                    thisThread.listRule = [];
                    api.sendMessage(`✅ Successfully deleted all rules of the group by ${userName}!\n🕒 ${currentDateTime}`, threadID, messageID);
                    break;
                }
            }
            default: {
                
                api.sendMessage(usageInstructions(), threadID, messageID);
                break;
            }
        }

        if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
        return writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
    });
}

module.exports.handleEvent = ({ event, api }) => {
    
    if (event.logMessageType === "log:subscribe") {
        const newMemberID = event.logMessageData.addedParticipants[0].userFbId;
        const newMemberName = event.logMessageData.addedParticipants[0].fullName;
        const { readFileSync } = require("fs-extra");
        const { join } = require("path");
        const pathData = join(__dirname, "data", "rule.json");

        const dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
        const thisThread = dataJson.find(item => item.threadID == event.threadID) || { listRule: [] };

       
        const currentDateTime = getCurrentDateTime();

        
        let msg = `[ GROUP RULES ]\n`;
        if (thisThread.listRule.length > 0) {
            thisThread.listRule.forEach((rule, index) => {
                msg += `${index + 1}. ${rule}\n`;
            });
        } else {
            msg += "There are currently no rules in the group.";
        }

        
        api.sendMessage({
            body: `${msg}\n🕒 ${currentDateTime}`,
            mentions: [{ tag: newMemberName, id: newMemberID }]
        }, event.threadID);
    }
};