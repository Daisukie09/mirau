module.exports.config = {
    name: "rule",
    eventType: ["log:subscribe"],
    version: "",
    credits: "Mr.Ben", // Trần Thanh Dương mod từ join của Mr.Ben
    description: "Send the group's rule list when a new member joins.",
};

module.exports.run = async function ({ api, event }) {
    const { readFileSync } = require("fs-extra");
    const { join } = require("path");
    const { threadID } = event;
    const pathData = join("modules", "commands", "data", "rule.json");
    const thread = global.data.threadData.get(threadID) || {};

    // Check if rules are allowed to be displayed
    if (typeof thread["rule"] != "undefined" && thread["rule"] == false) return;

    var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, listRule: [] };

    // Get new member info
    const newMemberID = event.logMessageData.addedParticipants[0].userFbId;
    const newMemberName = event.logMessageData.addedParticipants[0].fullName;

    // Get current time in "dd/mm/yyyy hh:mm:ss" format
    const getCurrentDateTime = () => {
        const date = new Date();
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const time = date.toLocaleTimeString("vi-VN", { hour12: false });
        return `${day}/${month}/${year} ${time}`;
    };
    const currentDateTime = getCurrentDateTime();

    if (thisThread.listRule.length != 0) {
        var msg = "", index = 0;
        for (const item of thisThread.listRule) msg += `${index += 1}. ${item}\n`;
        
        // Send message with tag of new member name and join time
        return api.sendMessage({
            body: `👋 Welcome ${newMemberName} \njoined the group at ⏰ ${currentDateTime}!\n\n[ GROUP RULES ]\n\n${msg}`,
            mentions: [{ tag: newMemberName, id: newMemberID }]
        }, threadID);
    }
}