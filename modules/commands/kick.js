module.exports.config = {
    name: "kick",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "D-Jukie",
    description: "Remove members from group by tag, reply or 'all'. Cancel kick by sending 'cancel'.",
    commandCategory: "Administrator",
    usages: "[tag/reply/all]",
    cooldowns: 0
};

const kickTracking = new Map();  // Store info about ongoing kicks

module.exports.run = async function ({ args, api, event, Threads, Users }) {
    const { participantIDs } = (await Threads.getData(event.threadID)).threadInfo;
    const botID = api.getCurrentUserID();
    const commandSender = event.senderID;

    // Kick handler with cancellable countdown
    const kickWithCountdown = async (userID) => {
        const name = await Users.getNameUser(userID); // Get user name
        let countdown = 10;

        api.sendMessage(`⚠️ Will kick ${name} in ${countdown} seconds...`, event.threadID, (err, info) => {
            if (err) return;

            // Save kick info to `kickTracking`
            kickTracking.set(info.messageID, { userID, commandSender, countdownID: null, canceled: false });

            // Set up countdown interval
            const countdownID = setInterval(async () => {
                countdown--;

                // If kick was canceled, stop countdown
                if (kickTracking.get(info.messageID)?.canceled) {
                    clearInterval(countdownID);
                    api.sendMessage(`❎ Kick canceled for ${name} by the command issuer.`, event.threadID); // Send cancel message
                    kickTracking.delete(info.messageID); // Delete info after cancel
                    return;
                }

                if (countdown > 0) {
                    // Update countdown message
                    await api.editMessage(`⚠️ Will kick ${name} in ${countdown} seconds...`, info.messageID);
                } else {
                    // Execute kick and delete info
                    clearInterval(countdownID);
                    api.removeUserFromGroup(userID, event.threadID);
                    api.sendMessage(`✅ Kicked ${name} from the group.`, event.threadID); // Send kick confirmation
                    kickTracking.delete(info.messageID);
                }
            }, 1000);

            // Save interval ID for later use
            kickTracking.set(info.messageID, { userID, commandSender, countdownID });
        });
    };

    try {
        if (args.join().includes('@')) {
            const mention = Object.keys(event.mentions);
            for (let userID of mention) {
                kickWithCountdown(userID); // Call kick function with userID
            }
        } else if (event.type === "message_reply") {
            const uid = event.messageReply.senderID;
            kickWithCountdown(uid); // Call kick function with uid
        } else if (args[0] === "all") {
            const listUserID = participantIDs.filter(ID => ID !== botID && ID !== event.senderID);
            for (let idUser of listUserID) {
                await kickWithCountdown(idUser); // Call kick function with idUser
            }
        } else {
            api.sendMessage("❎ Please tag, reply or use 'all' to kick.", event.threadID, event.messageID);
        }
    } catch {
        api.sendMessage('❎ An error occurred while kicking the user.', event.threadID, event.messageID);
    }

    // Check for 'cancel' command from user
    if (args[0] === "cancel") {
        const lastKickMessageID = Array.from(kickTracking.keys()).pop(); // Get last kick message ID
        const lastKickInfo = kickTracking.get(lastKickMessageID);

        if (lastKickInfo && lastKickInfo.commandSender === commandSender) {
            lastKickInfo.canceled = true; // Mark as canceled
            clearInterval(lastKickInfo.countdownID); // Stop countdown
            const name = await Users.getNameUser(lastKickInfo.userID); // Get user name for notification
            api.sendMessage(`❎ Canceled kick for ${name} from the group.`, event.threadID); // Send cancel notification
            kickTracking.delete(lastKickMessageID); // Delete canceled kick info
        } else {
            api.sendMessage("❎ No kick to cancel.", event.threadID);
        }
    }
};