module.exports.config = {
  name: "anti",
  version: "4.1.5",
  hasPermssion: 1,
  credits: "BraSL",
  description: "Anti change Box chat vip pro",
  commandCategory: "Group Admin",
  usages: "anti toggle",
  cooldowns: 5,
  images: [],
  dependencies: {
    "fs-extra": "",
  },
};
const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } = require("fs-extra");
const path = require('path');
const fs = require('fs');
const axios = require('axios');
module.exports.handleReply = async function ({ api, event, args, handleReply, Threads }) {
  const { senderID, threadID, messageID, messageReply } = event;
  const { author, permssion } = handleReply;
  const Tm = (require('moment-timezone')).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss || DD/MM/YYYY');
  const pathData = global.anti;
  const dataAnti = JSON.parse(readFileSync(pathData, "utf8"));

  if(author !== senderID ) return api.sendMessage(`❎ You are not the command user`,threadID);

var number = event.args.filter(i=> !isNaN(i))
 for (const num of number){
  switch (num) {
    case "1": {
      if (permssion < 1)
        return api.sendMessage(
          "⚠️ You don't have enough permissions to use this command",
          threadID,
          messageID
        );
      var NameBox = dataAnti.boxname;
      const antiImage = NameBox.find(
        (item) => item.threadID === threadID
      );
      if (antiImage) {
        dataAnti.boxname = dataAnti.boxname.filter((item) => item.threadID !== threadID);
        api.sendMessage(
          "☑️ Successfully disabled anti-change box name ",
          threadID,
          messageID
        );
      } else {
        var threadName = (await api.getThreadInfo(event.threadID)).threadName;
        dataAnti.boxname.push({
          threadID,
          name: threadName
        })
        api.sendMessage(
          "☑️ Successfully enabled anti-change box name",
          threadID,
          messageID
        );
      }
      writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
      break;
    }
    case "2": {
      if (permssion < 1)
        return api.sendMessage(
          "⚠️ You don't have enough permissions to use this command",
          threadID,
          messageID
        );
      const antiImage = dataAnti.boximage.find(
        (item) => item.threadID === threadID
      );
      if (antiImage) {
        dataAnti.boximage = dataAnti.boximage.filter((item) => item.threadID !== threadID);
        api.sendMessage(
          "☑️ Successfully disabled anti-change box image",
          threadID,
          messageID
        );
      } else {
        var threadInfo = await api.getThreadInfo(event.threadID);
        let url = threadInfo.imageSrc;
        let response = await global.api.imgur(url);
        let img = response.link;
        dataAnti.boximage.push({
          threadID,
          url: img,
        });
        api.sendMessage("☑️ Successfully enabled anti-change box image", threadID, messageID);
      }
      writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
      break;
    }
    case "3": {
      if (permssion < 1)
        return api.sendMessage(
          "⚠️ You don't have enough permissions to use this command",
          threadID,
          messageID
        );
      const NickName = dataAnti.antiNickname.find(
        (item) => item.threadID === threadID
      );

      if (NickName) {
        dataAnti.antiNickname = dataAnti.antiNickname.filter((item) => item.threadID !== threadID);
        api.sendMessage(
          "☑️ Successfully disabled anti-change nickname",
          threadID,
          messageID
        );
      } else {
        const nickName = (await api.getThreadInfo(event.threadID)).nicknames
        dataAnti.antiNickname.push({
          threadID,
          data: nickName
        });
        api.sendMessage(
          "☑️ Successfully enabled anti-change nickname",
          threadID,
          messageID
        );
      }
      writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
      break;
    }
    case "4": {
      if (permssion < 1)
        return api.sendMessage(
          "⚠️ You don't have enough permissions to use this command",
          threadID,
          messageID
        );
      const antiout = dataAnti.antiout;
      if (antiout[threadID] == true) {
        antiout[threadID] = false;
        api.sendMessage(
          "☑️ Successfully disabled anti-out",
          threadID,
          messageID
        );
      } else {
        antiout[threadID] = true;
        api.sendMessage(
          "☑️ Successfully enabled anti-out",
          threadID,
          messageID
        );
      }
      writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
      break;
    }
case "5": {
  const filepath = path.join(process.cwd(), 'systemdata', 'data', 'antiemoji.json');
  let data = JSON.parse(fs.readFileSync(filepath, 'utf8'));  
  let emoji = "";
  try {
    let threadInfo = await api.getThreadInfo(threadID);
    emoji = threadInfo.emoji;
  } catch (error) {
    console.error("Error fetching thread emoji status:", error);
  }
  if (!data.hasOwnProperty(threadID)) {
    data[threadID] = {
      emoji: emoji,
      emojiEnabled: true
    };
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
  } else {
    data[threadID].emojiEnabled = !data[threadID].emojiEnabled;
    if (data[threadID].emojiEnabled) {
      data[threadID].emoji = emoji;
    }
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
  }
  const statusMessage = data[threadID].emojiEnabled ? "On" : "Off";
  api.sendMessage(`☑️ ${statusMessage} anti-emoji mode`, threadID, messageID);
  break;
}
 case "6": {
  const filepath = path.join(process.cwd(), 'systemdata', 'data', 'antitheme.json');
  let data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  let theme = "";
  try {
    const threadInfo = await Threads.getInfo(threadID);
    theme = threadInfo.threadTheme.id;
  } catch (error) {
    console.error("Error fetching thread theme:", error);
  }
  if (!data.hasOwnProperty(threadID)) {
    data[threadID] = {
      themeid: theme || "",
      themeEnabled: true
    };
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
  } else {
    data[threadID].themeEnabled = !data[threadID].themeEnabled;
    if (data[threadID].themeEnabled) {
      data[threadID].themeid = theme || "";
    }
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
  }
  const statusMessage = data[threadID].themeEnabled ? "On" : "Off";
  api.sendMessage(`☑️ ${statusMessage} anti-theme mode`, threadID, messageID);
  break;
}
  case "7": {
  const dataAnti = __dirname + '/data/antiqtv.json';
 const info = await api.getThreadInfo(event.threadID);
 if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
 return api.sendMessage('❎ Bot needs admin privileges to execute this command', event.threadID, event.messageID);
 let data = JSON.parse(fs.readFileSync(dataAnti));
 const { threadID, messageID } = event;
 if (!data[threadID]) {
 data[threadID] = true;
 api.sendMessage(`☑️ Successfully enabled anti-qtv`, threadID, messageID);
 } else {
 data[threadID] = false;
 api.sendMessage(`☑️ Successfully disabled anti-qtv`, threadID, messageID);
 }
 fs.writeFileSync(dataAnti, JSON.stringify(data, null, 4));
 break;
}
   case "8": {
  const antiJoinPath = path.join(__dirname, 'data', 'threadData.json ');
  let antiJoinData = JSON.parse(fs.readFileSync(antiJoinPath, 'utf8'));
  const { threadID, messageID } = event;
  
  if (!antiJoinData.hasOwnProperty(threadID)) {
    antiJoinData[threadID] = true;
    fs.writeFileSync(antiJoinPath, JSON.stringify(antiJoinData, null, 2), 'utf8');
    api.sendMessage(`☑️ Successfully enabled anti-add-member mode`, threadID, messageID);
  } else {
    antiJoinData[threadID] = false;
    fs.writeFileSync(antiJoinPath, JSON.stringify(antiJoinData, null, 2), 'utf8');
    api.sendMessage(`☑️ Successfully disabled anti-add-member mode`, threadID, messageID);
  }
  break;
};
    case "9": {
      const antiImage = dataAnti.boximage.find(
        (item) => item.threadID === threadID
      );
      const antiBoxname = dataAnti.boxname.find(
        (item) => item.threadID === threadID
      );
      const antiNickname = dataAnti.antiNickname.find(
        (item) => item.threadID === threadID
      );
      return api.sendMessage(`[ CHECK ANTI BOX ]\n────────────────────\n|› 1. anti namebox: ${antiBoxname ? "on" : "off"}\n|› 2. anti imagebox: ${antiImage ? "on" : "off" }\n|› 3. anti nickname: ${antiNickname ? "on" : "off"}\n|› 4. anti out: ${dataAnti.antiout[threadID] ? "on" : "off"}\n────────────────────\n|› Above are the statuses of each anti mode`, threadID);
      break;
    }
    default: {
      return api.sendMessage(`❎ The number you selected is not in the command`, threadID);
      }
    }
  }
};

module.exports.run = async ({ api, event, args, permssion, Threads }) => {
  const { threadID, messageID, senderID } = event;
  const threadSetting = (await Threads.getData(String(threadID))).data || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : global.config.PREFIX;
  return api.sendMessage(`╭─────────────⭓\n│ Anti Change Info Group\n├─────⭔\n│ 1. anti namebox: prevent changing group name\n│ 2. anti boximage: prevent changing group image\n│ 3. anti nickname: prevent changing user nicknames\n│ 4. anti out: prevent members from leaving\n│ 5. anti emoji: prevent changing group emoji\n│ 6. anti theme: prevent changing group theme\n│ 7. anti qtv: prevent changing admins (avoid box theft)\n│ 8. anti join: prevent adding new members to group\n│ 9. check anti status of the group\n├────────⭔\n│ 📌 Reply with the number to select the mode you want to toggle\n╰─────────────⭓`,
        threadID, (error, info) => {
            if (error) {
              return api.sendMessage("❎ An error occurred!", threadID);
            } else {
              global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                permssion
          });
       }
   }, messageID);
};