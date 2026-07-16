const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytsearch = require("yt-search");

const RAPIDAPI_KEY = "f5a15718e2msha1be8bbea46f76ep146606jsn8faef601eed8";
const RAPIDAPI_HOST = "youtube-mp36.p.rapidapi.com";
const RAPIDAPI_USER = "kirigayathunder";

module.exports.config = {
  name: "music",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "John Lester",
  description: "Search and play music from YouTube",
  commandCategory: "media",
  usages: "<song name>",
  cooldowns: 10,
  dependencies: {
    "axios": "",
    "yt-search": "",
    "fs": "",
    "path": ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(" ");
  if (!query) return api.sendMessage("Usage: music <song name>", threadID, messageID);

  const spin = await api.sendMessage(`🔍 Searching for ${query}...`, threadID, messageID);

  try {
    const search = await ytsearch(query);
    if (!search.videos.length) {
      await api.unsendMessage(spin.messageID);
      return api.sendMessage("❌ No results found.", threadID, messageID);
    }

    const video = search.videos[0];
    const videoId = video.videoId;

    await api.unsendMessage(spin.messageID);
    const converting = await api.sendMessage(`⏳ Converting ${video.title} to MP3...`, threadID, messageID);

    const apiUrl = `https://${RAPIDAPI_HOST}/dl?id=${videoId}`;
    const conv = await axios.get(apiUrl, {
      headers: { "x-rapidapi-host": RAPIDAPI_HOST, "x-rapidapi-key": RAPIDAPI_KEY },
      timeout: 30000,
    });

    if (conv.data.status !== "ok" || !conv.data.link) {
      await api.unsendMessage(converting.messageID);
      return api.sendMessage("❌ Failed to convert video.", threadID, messageID);
    }

    const mp3Url = conv.data.link;
    const dur = Math.floor(conv.data.duration);
    const mins = Math.floor(dur / 60);
    const secs = dur % 60;

    const fileName = `${video.title.replace(/[/\\?%*:|"<>]/g, "-")}.mp3`;
    const filePath = path.join(__dirname, fileName);

    const dl = await axios.get(mp3Url, {
      responseType: "stream",
      timeout: 120000,
      headers: { "User-Agent": `Mozilla/5.0 ${RAPIDAPI_USER}` },
    });

    const writer = fs.createWriteStream(filePath);
    dl.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    await api.unsendMessage(converting.messageID);

    await api.sendMessage({
      body: `🎵 ${video.title}\n👤 ${video.author?.name || "Unknown"}\n⏱️ ${mins}:${String(secs).padStart(2, "0")}\n📊 ${video.views?.toLocaleString() || "?"} views`,
      attachment: fs.createReadStream(filePath),
    }, threadID, () => fs.unlinkSync(filePath), messageID);
  } catch (e) {
    await api.unsendMessage(spin.messageID).catch(() => {});
    api.sendMessage(`❌ Error: ${e.message}`, threadID, messageID);
  }
};
