const { join } = require("path");
const { readFileSync, writeFileSync } = require("fs-extra");
const moment = require('moment-timezone');

module.exports.config = {
    name: "autosetname",
    eventType: ["log:subscribe"],
    version: "1.0.3",
    credits: "D-Jukie",
    description: "Auto set nickname for new members"
};

module.exports.run = async function({ api, event }) {
    const { threadID } = event;
    const memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId);
    const pathData = join("./modules/commands", "data", "autosetname.json");
    
    // Read data from JSON file
    var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };

    // If no name configuration, exit
    if (thisThread.nameUser.length == 0) return;

    for (let idUser of memJoin) {
        const nameData = await api.getUserInfo(idUser);
        const userName = nameData[idUser].name;
        
        // Replace {name} and {time} in the name
        const setName = thisThread.nameUser[0]
            .replace(/{name}/g, userName) // Replace {name} with user name
            .replace(/{time}/g, moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss | DD/MM/YYYY')); // Replace {time} with current time

        // Set nickname for member
        await new Promise(resolve => setTimeout(resolve, 100));
        api.changeNickname(setName, threadID, idUser);
    }

    return api.sendMessage(`Auto nickname set for new members!`, threadID, event.messageID);
}