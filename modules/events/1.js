module.exports.config = {
    name: "updateQtv",
    eventType: ["log:thread-admins"],
    version: "1.0.1",
    author: "Trịnh Đình Phát",
    info: "Auto refresh the group admin list",
};

module.exports.run = async function ({ event: { threadID, logMessageType }, api, Threads }) {
    try {
        console.log("Received event:", logMessageType); // Check event

        switch (logMessageType) {
            case "log:thread-admins": {
                console.log("Start fetching group info..."); // Start notification
                const threadInfo = await api.getThreadInfo(threadID);
                console.log("Group info:", threadInfo); // Print group info

                if (threadInfo && threadInfo.adminIDs) {
                    const qtvCount = threadInfo.adminIDs.length;

                    // Update group data
                    await Threads.setData(threadID, { threadInfo });
                    global.data.threadInfo.set(threadID, threadInfo);

                    // Send notification and get messageID
                    api.sendMessage(`✅ Auto Update ${qtvCount} Administrators!`, threadID, (err, info) => {
                        if (err) return console.error(err);

                        // Recall message after 3 seconds
                        setTimeout(() => {
                            api.unsendMessage(info.messageID, (err) => {
                                if (err) console.error(`Cannot recall message: ${err}`);
                            });
                        }, 3000); // 3000ms = 3 seconds
                    });
                } else {
                    api.sendMessage(`⚠️ Unable to get group info or no administrators.`, threadID, (err, info) => {
                        if (err) return console.error(err);

                        // Recall message after 3 seconds
                        setTimeout(() => {
                            api.unsendMessage(info.messageID, (err) => {
                                if (err) console.error(`Cannot recall message: ${err}`);
                            });
                        }, 3000);
                    });
                }
                break; // Add break to exit switch case
            }
            default:
                console.log("Unhandled event type:", logMessageType); // Notify unhandled event type
                break; // Skip unnecessary event types
        }
    } catch (error) {
        console.error(`❌ An error occurred while updating admins: ${error}`);
        api.sendMessage(`❌ An error occurred while updating admins.`, threadID, (err, info) => {
            if (err) return console.error(err);

            // Recall message after 3 seconds
            setTimeout(() => {
                api.unsendMessage(info.messageID, (err) => {
                    if (err) console.error(`Cannot recall message: ${err}`);
                });
            }, 3000);
        });
    }
};