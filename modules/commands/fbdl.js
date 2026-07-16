const getFBInfo = require("@xaviabot/fb-downloader");
const axios = require("axios");

module.exports.config = {
  name: "fbdl",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "VincentSensei",
  description: "Download Facebook videos",
  commandCategory: "media",
  usages: "<url>",
  cooldowns: 10,
  dependencies: {
    "@xaviabot/fb-downloader": "",
    "axios": ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const url = args[0];
  if (!url) return api.sendMessage("Usage: fbdl <Facebook video URL>", threadID, messageID);
  if (!url.includes("facebook.com") && !url.includes("fb.watch") && !url.includes("fb.com"))
    return api.sendMessage("Please provide a valid Facebook video URL.", threadID, messageID);

  const spin = await api.sendMessage("⏳ Downloading Facebook video...", threadID, messageID);

  try {
    const result = await getFBInfo(url);
    if (!result || (!result.sd && !result.hd)) {
      await api.unsendMessage(spin.messageID);
      return api.sendMessage("❌ Could not fetch video. Facebook may require authentication.", threadID, messageID);
    }

    const videoUrl = result.hd || result.sd;
    const title = result.title
      ? result.title.replace(/&amp;/g, "&").replace(/&#x?\w+;/g, "")
      : "Facebook Video";

    await api.unsendMessage(spin.messageID);

    const resp = await axios.get(videoUrl, { responseType: "stream", timeout: 60000 });
    resp.data.path = "fb_video.mp4";

    await api.sendMessage({ body: `📹 ${title}`, attachment: resp.data }, threadID, messageID);
  } catch (e) {
    await api.unsendMessage(spin.messageID).catch(() => {});
    api.sendMessage(`❌ Error: ${e.message || "Unable to fetch video."}`, threadID, messageID);
  }
};
