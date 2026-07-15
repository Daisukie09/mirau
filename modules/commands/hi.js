module.exports.config = {
  name: "hi",
  version: "3.0.0",
  hasPermssion: 0,
  credit: "Vtuan",
  description: "hi sends sticker and images",
  commandCategory: "Utility",
  usages: "[text]",
  cooldowns: 5
}

module.exports.handleEvent = async ({ api, event, Threads, Users }) => {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");
  const moment = require("moment-timezone");
  var gio = moment.tz("Asia/Ho_Chi_Minh").format("D/MM/YYYY || HH:mm:ss");
  var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
  if (thu == 'Sunday') thu = '𝐒𝐮𝐧𝐝𝐚𝐲';
  if (thu == 'Monday') thu = '𝐌𝐨𝐧𝐝𝐚𝐲';
  if (thu == 'Tuesday') thu = '𝐓𝐮𝐞𝐬𝐝𝐚𝐲';
  if (thu == 'Wednesday') thu = '𝐖𝐞𝐝𝐧𝐞𝐬𝐝𝐚𝐲';
  if (thu == "Thursday") thu = '𝐓𝐡𝐮𝐫𝐬𝐝𝐚𝐲';
  if (thu == 'Friday') thu = '𝐅𝐫𝐢𝐝𝐚𝐲';
  if (thu == 'Saturday') thu = '𝐒𝐚𝐭𝐮𝐫𝐝𝐚𝐲';

  let KEY = ["helo", "hi", "hai", "chào", "chao", "hí", "híí", "hì", "hìì", "lô", "hii", "hello", "hê nhô"];
  let thread = global.data.threadData.get(event.threadID) || {};
  if (typeof thread["hi"] == "undefined" || thread["hi"] == false) return;

  if (KEY.includes(event.body.toLowerCase())) {
    let data = [
      "181834558976193", "157616594731323", "334220426780978",
      "334196663450021", "1390600217908126", "1390506597917488",
      // ... (rest of the sticker IDs)
    ];
    let sticker = data[Math.floor(Math.random() * data.length)];
    let hours = moment.tz('Asia/Ho_Chi_Minh').format('HHmm');
    let currentTime = moment.tz('Asia/Ho_Chi_Minh').format('HH:mm:ss'); // Current time with seconds
    let data2 = ["Like hell=))", "Not happy", "Not happy ❤", "No joy 😘"];
    let text = data2[Math.floor(Math.random() * data2.length)];
    
    let session = (
      hours > 0001 && hours <= 400 ? "𝐞𝐚𝐫𝐥𝐲 𝐦𝐨𝐫𝐧𝐢𝐧𝐠" : 
      hours > 401 && hours <= 700 ? "𝐞𝐚𝐫𝐥𝐲 𝐦𝐨𝐫𝐧𝐢𝐧𝐠" :
      hours > 701 && hours <= 1000 ? "𝐦𝐨𝐫𝐧𝐢𝐧𝐠" :
      hours > 1001 && hours <= 1200 ? "𝐧𝐨𝐨𝐧" : 
      hours > 1201 && hours <= 1700 ? "𝐚𝐟𝐭𝐞𝐫𝐧𝐨𝐨𝐧" : 
      hours > 1701 && hours <= 1800 ? "𝐥𝐚𝐭𝐞 𝐚𝐟𝐭𝐞𝐫𝐧𝐨𝐨𝐧" : 
      hours > 1801 && hours <= 2100 ? "𝐞𝐯𝐞𝐧𝐢𝐧𝐠" : 
      hours > 2101 && hours <= 2400 ? "𝐧𝐢𝐠𝐡𝐭" : 
      "𝐞𝐫𝐫𝐨𝐫"
    );

    let name = await Users.getNameUser(event.senderID);
    let mention = {
      tag: name,
      id: event.senderID
    };

    const tdung = require('./../../includes/datajson/gai.json');
    var image1 = tdung[Math.floor(Math.random() * tdung.length)].trim();
    var image2 = tdung[Math.floor(Math.random() * tdung.length)].trim();

    function vtuanhihi(image, vtuandz, callback) {
      request(image).pipe(fs.createWriteStream(__dirname + `/` + vtuandz)).on("close", callback);
    }

    let callback = function () {
      return api.sendMessage({
        body: `What the hell are you greeting for ${mention.tag}\nHave a ${session} ${text}\n⏰: ${currentTime}`,
        mentions: [mention],
        attachment: [fs.createReadStream(__dirname + `/1.png`), fs.createReadStream(__dirname + `/2.png`)]
      }, event.threadID, () => {
        fs.unlinkSync(__dirname + `/1.png`);
        fs.unlinkSync(__dirname + `/2.png`);
      }, event.messageID);
    };

    vtuanhihi(image1, '1.png', () => { vtuanhihi(image2, '2.png', callback) });

    let msg = {};
    api.sendMessage(msg, event.threadID, (e, info) => {
      setTimeout(() => {
        api.sendMessage({ sticker: sticker }, event.threadID);
      }, 1500);
    }, event.messageID);
  }
}

module.exports.languages = {
  "vi": {
    "on": "on",
    "off": "off",
    "successText": `${this.config.name} successful`,
  },
  "en": {
    "on": "on",
    "off": "off",
    "successText": "success!",
  }
}

module.exports.run = async ({ event, api, Threads, getText }) => {
  let { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;
  if (typeof data["hi"] == "undefined" || data["hi"] == true) data["hi"] = false;
  else data["hi"] = true;
  
  await Threads.setData(threadID, {
    data
  });
  global.data.threadData.set(threadID, data);
  
  return api.sendMessage(`${(data["hi"] == false) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
}
