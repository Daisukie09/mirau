module.exports.config = {
  name: "uid",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mirai Team",
  description: "Get user ID or group ID.",
  commandCategory: "User",
  usePrefix: false,
  cooldowns: 0
};

const axios = require("axios");
const downloader = require('image-downloader');
const fse = require('fs-extra');

async function streamURL(url, mime = 'jpg') {
  const dest = `${__dirname}/cache/${Date.now()}.${mime}`;
  await downloader.image({ url, dest });
  setTimeout(() => fse.unlinkSync(dest), 60 * 1000);
  return fse.createReadStream(dest);
}

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;

  if (args[0] === "box") { // Get box ID and avatar
    const boxID = event.threadID;
    const threadInfo = await api.getThreadInfo(boxID);

    if (threadInfo.imageSrc) { // Check if box has an avatar
      const boxImage = await streamURL(threadInfo.imageSrc);
      return api.sendMessage({ body: `This box ID is: ${boxID}`, attachment: boxImage }, threadID, messageID);
    } else {
      return api.sendMessage(`Box ID is: ${boxID}`, threadID, messageID);
    }
  }

  if (event.type === "message_reply") {
    const uid = event.messageReply.senderID;
    const userImage = await streamURL(`https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    return api.sendMessage({ body: `${uid}`, attachment: userImage }, threadID, messageID);
  }

  if (!args[0]) {
    const userID = event.senderID;
    const userImage = await streamURL(`https://graph.facebook.com/${userID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    return api.sendMessage({ body: `${userID}`, attachment: userImage }, threadID, messageID);
  }

  if (args[0].indexOf(".com/") !== -1) {
    try {
      const link = args[0]; // Get link from args
      const response = await axios.get(`https://ffb.vn/api/tool/get-id-fb?idfb=${encodeURIComponent(link)}`);
      
      // Check API response
      if (response.data.error === 0) {
        const uid = response.data.id;
        const name = response.data.name;

        // Send ID and user photo
        const userImage = await streamURL(`https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
        return api.sendMessage({ body: `ID: ${uid}\nName: ${name}`, attachment: userImage }, threadID, messageID);
      } else {
        return api.sendMessage("⚠️ Cannot get ID from this link: " + response.data.msg, threadID, messageID);
      }
      
    } catch (error) {
      console.error(error);
      return api.sendMessage("⚠️ An error occurred while getting ID.", threadID, messageID);
    }
  }

  for (const [id, name] of Object.entries(event.mentions)) {
    const userImage = await streamURL(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    await api.sendMessage({ body: `${name.replace('@', '')}: ${id}`, attachment: userImage }, threadID);
  }
};