const fs = require("fs");
const { resolve } = require("path");

module.exports.config = {
    name: "antiqtv",
    eventType: ["log:thread-admins"],
    version: "1.0.0",
    credits: "Trịnh Đình Phát",
    description: "Prevent admin changes",
};


module.exports.run = async function ({ event, api }) {
    const { logMessageType, logMessageData, author, threadID } = event;
    const botID = api.getCurrentUserID();
    // Check if the event sender is the bot to exclude it
    if (author === botID) return;

    const path = resolve(__dirname, '../commands', 'data', 'antiqtv.json');

    try {
        const dataA = JSON.parse(fs.readFileSync(path));

        const foundGroup = Object.keys(dataA).find(groupID => groupID === threadID);

        // Check if dataA exists and foundGroup is not undefined
        if (dataA && foundGroup !== undefined && dataA[foundGroup] === true) {
            switch (logMessageType) {
                case "log:thread-admins": {
                    if (logMessageData.ADMIN_EVENT === "add_admin" || logMessageData.ADMIN_EVENT === "remove_admin") {
                        if (logMessageData.TARGET_ID === botID) return; // Bot is not affected

                        if (logMessageData.ADMIN_EVENT === "remove_admin") {
                            // Remove admin rights from the person who performed the removal
                            api.changeAdminStatus(threadID, author, false);
                            api.changeAdminStatus(threadID, logMessageData.TARGET_ID, true);

                            // Re-add admin rights to the person who was removed

                        } else if (logMessageData.ADMIN_EVENT === "add_admin") {
                            // Remove admin rights from both the adder and the added person
                            api.changeAdminStatus(threadID, author, false);
                            api.changeAdminStatus(threadID, logMessageData.TARGET_ID, false);
                        }

                        function editAdminsCallback(err) {
                            if (err) return api.sendMessage("» Hehehehe! ", threadID, event.messageID);
                            return api.sendMessage("» Anti-theft mode activated", threadID, event.messageID);
                        }
                    }
                    break;
                }
            }
        } else {
            // Handle when group ID does not exist in data or is in false state (if needed)
        }
    } catch (error) {

    }
};
