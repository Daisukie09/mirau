const moment = require("moment-timezone");
const axios = require("axios");

module.exports.config = {
  name: "log",
  eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
  version: "1.0.0",
  credits: "Tpk",
  description: "Log bot activity notifications!",
  envConfig: {
    enable: true,
  },
};

module.exports.run = async function ({ api, event, Users, Threads, Currencies }) {
  const logger = require("../../utils/log");
  const botID = api.getCurrentUserID();
  const threadInfo = await api.getThreadInfo(event.threadID);
  const threadName = threadInfo.threadName || "Name does not exist";
  const threadMem = threadInfo.participantIDs.length;
  const sex = threadInfo.approvalMode;
  const pd = sex === false ? "Off" : sex === true ? "On" : '\n';
  const qtv = threadInfo.adminIDs.length;
  const icon = threadInfo.emoji;
  const nameUser = global.data.userName.get(event.author) || await Users.getNameUser(event.author);
  const time = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");

  let task = "";

  switch (event.logMessageType) {
    case "log:thread-name": {
      const newName = event.logMessageData.name || "Name does not exist";
      task = `User changed group name to ${newName}`;
      await Threads.setData(event.threadID, { name: newName });
      break;
    }
    case "log:subscribe": {
      if (event.logMessageData.addedParticipants.some(i => i.userFbId == botID)) {
        task = "User added bot to a new group!";
      }
      break;
    }
    case "log:unsubscribe": {
      if (event.logMessageData.leftParticipantFbId == botID) {
        if (event.senderID == botID) return;
        const data = (await Threads.getData(event.threadID)).data || {};
        data.banned = true;
        const reason = "Kicked bot without permission";
        data.reason = reason || null;
        data.dateAdded = time;
        await Threads.setData(event.threadID, { data });
        global.data.threadBanned.set(event.threadID, { reason: data.reason, dateAdded: data.dateAdded });
        task = "User kicked the bot out of the group!";
      }
      break;
    }
    default:
      break;
  }

  if (task.length === 0) return;

  const formReport = `|› Group Name: ${threadName}\n|› TID: ${event.threadID}\n|› Member Count: ${threadMem}\n|› Approval: ${pd}\n|› Admin: ${qtv}\n|› Emoji: ${icon ? icon : 'Not in use'}\n──────────────────\n|› Action: ${task}\n|› User Name: ${nameUser}\n|› Uid: ${event.author}\n|› Facebook Link: https://www.facebook.com/profile.php?id=${event.author}\n──────────────────\n⏰️=『${time}』=⏰️`;

  return api.sendMessage(formReport, global.config.NDH[0], (error, info) => {
    if (error) return logger(formReport, "[ Logging Event ]");
  });
};
