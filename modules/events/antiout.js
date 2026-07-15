module.exports.config = {
    name: "antiout",
    eventType: ["log:unsubscribe"],
    version: "1.0.7",
    credits: "ProCoderMew",
    description: "Listen events",
    dependencies: {
        "path": ""
    }
};

module.exports.run = async function ({ api, event, Users }) {
    const { resolve } = require("path");
    const path = resolve(__dirname, '../commands', 'data', 'antiout.json');
    const { antiout } = require(path);
    const { logMessageData, author, threadID } = event;
    const id = logMessageData.leftParticipantFbId;
  const moment = require("moment-timezone");
     var timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss")
  var fullYear = global.client.getTime("fullYear");
    if (author == id && id != api.getCurrentUserID()) {
        const name = await Users.getNameUser(id) || "Facebook User";
        if (antiout.hasOwnProperty(threadID) && antiout[threadID] == true) {
    try {
    await api.addUserToGroup(id, threadID);
  return api.sendMessage(`[ ANTIOUT ]\n────────────────────\n⚠️ Auto-add user mode activated when user leaves group\n🔰 Status: Success\n👤 User: ${name}\n⏰ Time: ${timeNow} - ${fullYear}\n────────────────────\n⛔ If adding fails, the user may have blocked the bot`, event.threadID, async (err, info) => {
   await new Promise(resolve => setTimeout(resolve, 60 * 1000));
 return api.unsendMessage(info.messageID);
          }, event.messageID);
      } catch (e) {
  return api.sendMessage(`[ ANTIOUT ]\n────────────────────\n⚠️ Auto-add user mode activated when user leaves group\n🔰 Status: Failed\n👤 User: ${name}\n⏰ Time: ${timeNow} - ${fullYear}\n────────────────────\n⛔ If adding fails, the user may have blocked the bot`, event.threadID, async (err, info) => {
   await new Promise(resolve => setTimeout(resolve, 60 * 1000));
 return api.unsendMessage(info.messageID);
               }, event.messageID); 
            }
        }
    }
    return;
}