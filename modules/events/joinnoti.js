module.exports.config = {
    name: "join",
    eventType: ["log:subscribe"],
    version: "1.0.0",
    credits: "TDF-2803",
    description: "Notification for members joining the group"
};

module.exports.run = async function ({ api, event }) {
    const { threadID } = event;
    const botID = api.getCurrentUserID();
    const botName = global.config.BOTNAME || "TDF-2803";
    const prefix = global.config.PREFIX || "/";

    try {
        if (event.logMessageData.addedParticipants.some(i => i.userFbId == botID)) {
            api.changeNickname("[ " + prefix + " ] " + botName, threadID, botID);
            return api.sendMessage("Connected successfully! Use " + prefix + "menu to view commands.", threadID);
        } else {
            var names = [];
            for (var i = 0; i < event.logMessageData.addedParticipants.length; i++) {
                names.push(event.logMessageData.addedParticipants[i].fullName);
            }
            return api.sendMessage("Welcome " + names.join(", ") + " to the group!", threadID);
        }
    } catch (e) {
        console.log("Join error:", e.message);
    }
}
