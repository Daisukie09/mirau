module.exports.config = {
  name: "setmoney",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "CatalizCS",
  description: "Adjust user information",
  commandCategory: "Admin",
  usages: "[add/set/clean/reset] [Amount] [Tag user]",
  cooldowns: 5
};

module.exports.run = async function({ event, api, Currencies, args }) {
  const { threadID, messageID, senderID } = event;
  const { throwError } = global.utils;
  const mentionID = Object.keys(event.mentions);
  const money = String(args[1]);

  var message = [];
  var error = [];
  try {
    switch (args[0]) {
      case "add": {
        if (mentionID.length != 0) {
          for (singleID of mentionID) {
            if (!money || isNaN(money)) return api.sendMessage('❎ Money must be a number', threadID, messageID);
            try {
              await Currencies.increaseMoney(singleID, money);
              message.push(singleID);
            } catch (e) { error.push(e);
              console.log(e) };
          }
          return api.sendMessage(`✅ Added ${formatNumber(money)}$ to ${message.length} people`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ Cannot add money for ${error.length} people`, threadID) }, messageID);
        } else {
          if (!money || isNaN(money)) return api.sendMessage('Money must be a number', threadID, messageID);
          try {
            var uid = event.senderID;
            if (event.type == "message_reply") {
              uid = event.messageReply.senderID
            } else if (args.length === 3) {
              uid = args[2]
            }
            console.log(args)
            await Currencies.increaseMoney(uid, String(money));
            message.push(uid);
          } catch (e) { error.push(e) };
          return api.sendMessage(`✅ Added ${formatNumber(money)}$ to ${uid !== senderID ? '1 person' : 'self'}`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ Cannot add money for ${uid !== senderID ? '1 person' : 'self'}`, threadID) }, messageID);
        }
      }
      case 'all':
      {
        const allUserID = event.participantIDs;
        const mon = money
        console.log(allUserID)
        for (const singleUser of allUserID) {
          await Currencies.increaseMoney(singleUser, String(mon));
        }
        api.sendMessage(`✅ Successfully set ${args[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} for all members`, event.threadID)
      }
      break;
      case "set": {
        if (mentionID.length != 0) {
          for (singleID of mentionID) {
            if (!money || isNaN(money)) return throwError(this.config.name, threadID, messageID);
            try {
              await Currencies.setData(singleID, { money });
              message.push(singleID);
            } catch (e) { error.push(e) };
          }
          return api.sendMessage(`✅ Successfully set ${formatNumber(money)}$ for ${message.length} people`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ Cannot set money for ${error.length} people`, threadID) }, messageID);
        } else {
          if (!money || isNaN(money)) return throwError(this.config.name, threadID, messageID);
          try {
            var uid = event.senderID;
            if (event.type == "message_reply") {
              uid = event.messageReply.senderID
            }
            await Currencies.setData(uid, { money });
            message.push(uid);
          } catch (e) { error.push(e) };
          return api.sendMessage(`✅ Successfully set ${formatNumber(money)}$ for ${uid !== senderID ? '1 person' : 'self'}`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ Cannot set money for ${uid !== senderID ? '1 person' : 'self'}`, threadID) }, messageID);
        }
      }

      case "clean": {
        if (args[1] === 'all') {
          const data = event.participantIDs;
          for (const userID of data) {
            const datas = (await Currencies.getData(userID)).data
            if (datas !== undefined) {
              datas.money = '0'
              await Currencies.setData(userID, datas);
            }
          }
          return api.sendMessage("✅ Successfully cleared all money of the group", event.threadID);
        }
        if (mentionID.length != 0) {
          for (singleID of mentionID) {
            try {
              await Currencies.setData(singleID, { money: 0 });
              message.push(singleID);
            } catch (e) { error.push(e) };
          }
          return api.sendMessage(`✅ Successfully cleared all money of ${message.length} people`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ Cannot clear all money of ${error.length} people`, threadID) }, messageID);
        } else {
          try {
            var uid = event.senderID;
            if (event.type == "message_reply") {
              uid = event.messageReply.senderID
            }
            await Currencies.setData(uid, { money: 0 });
            message.push(uid);
          } catch (e) { error.push(e) };
          return api.sendMessage(`✅ Successfully cleared money of ${uid !== senderID ? '1 person' : 'self'}`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ Cannot clear all money of ${uid !== senderID ? '1 person' : 'self'}`, threadID) }, messageID);
        }
      }

      case "reset": {
        const allUserData = await Currencies.getAll(['userID']);
        for (const userData of allUserData) {
            const userID = userData.userID;
            try {
                await Currencies.setData(userID, { money: 0 });
                message.push(userID);
            } catch (e) { error.push(e) };
        }
        return api.sendMessage(`✅ Reset all money data of ${message.length} people`, threadID, function () { if (error.length != 0) return api.sendMessage(`❎ Cannot reset money data of ${error.length} people`, threadID) }, messageID);
        for (singleID of mentionID) {
            try {
                await Currencies.setData(singleID, { money: 0 });
                message.push(singleID);
            } catch (e) { error.push(e) };
        }
        return api.sendMessage(`✅ Cleared money data of ${message.length} people`, threadID, function () { if (error.length != 0) return api.sendMessage(`❎ Cannot clear money data of ${error.length} people`, threadID) }, messageID);
}

      default: {
        return global.utils.throwError(this.config.name, threadID, messageID);
      }
    }
  } catch (e) {
    console.log(e)
  }
}
function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}