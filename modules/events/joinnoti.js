const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
            const participants = event.logMessageData.addedParticipants;
            const threadInfo = await api.getThreadInfo(threadID);
            const memberCount = threadInfo.participantIDs ? threadInfo.participantIDs.length : (threadInfo.members || []).length;

            for (const user of participants) {
                const name = user.fullName || "User";
                const uid = user.userFbId;

                try {
                    const canvasUrl = `https://betadash-api-swordslush-production.up.railway.app/welcome?name=${encodeURIComponent(name)}&userid=${uid}&threadname=${encodeURIComponent(threadInfo.name || "Group")}&members=${memberCount}`;
                    const response = await axios.get(canvasUrl, { responseType: 'arraybuffer' });
                    const imgPath = path.join(__dirname, 'cache', `welcome_${uid}.png`);
                    fs.writeFileSync(imgPath, Buffer.from(response.data));
                    api.sendMessage({
                        body: `🌸 Welcome ${name} to the group!`,
                        attachment: fs.createReadStream(imgPath)
                    }, threadID, () => fs.unlink(imgPath, () => {}));
                } catch (err) {
                    console.log("Join canvas error:", err.message);
                    api.sendMessage(`🌸 Welcome ${name} to the group!`, threadID);
                }
            }
        }
    } catch (e) {
        console.log("Join error:", e.message);
    }
}
