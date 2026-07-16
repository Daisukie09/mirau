const axios = require("axios");
const Shoti = require("shoti");
const { ttdl } = require("ab-downloader");

let shotiClient;

function getClient() {
  if (!shotiClient) {
    try { shotiClient = new Shoti(); } catch { shotiClient = null; }
  }
  return shotiClient;
}

module.exports.config = {
  name: "shoti",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "VincentSensei",
  description: "Send a random TikTok video",
  commandCategory: "media",
  usages: "",
  cooldowns: 10,
  dependencies: {
    "axios": "",
    "shoti": "",
    "ab-downloader": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  const spin = await api.sendMessage("🎲 Searching for a Shoti video...", threadID, messageID);

  try {
    const client = getClient();
    if (!client) {
      await api.unsendMessage(spin.messageID);
      return api.sendMessage("❌ Shoti API not available.", threadID, messageID);
    }

    const data = await client.getShoti({ type: "video" });
    if (!data || !data.content) {
      await api.unsendMessage(spin.messageID);
      return api.sendMessage("❌ No video found. Try again later.", threadID, messageID);
    }

    const { content: videoUrl, user, title, region, duration } = data;
    const nickname = user?.nickname || "Unknown";
    const username = user?.username || "unknown";

    const infoMsg =
      `🎬 TikTok Video\n` +
      `📹 User: ${nickname} (@${username})\n` +
      (title ? `📝 Title: ${title}\n` : "") +
      (region ? `🌍 Region: ${region}\n` : "") +
      `⏱️ Duration: ${Math.floor(parseInt(duration || 0) / 1000)}s`;

    await api.unsendMessage(spin.messageID);

    const itemId = videoUrl.match(/item_id=(\d+)/);
    let downloadUrl = videoUrl;

    if (itemId) {
      const tiktokUrl = `https://www.tiktok.com/@${username}/video/${itemId[1]}`;
      try {
        const ttdlResult = await ttdl(tiktokUrl);
        if (ttdlResult?.video?.[0]) downloadUrl = ttdlResult.video[0];
      } catch {}
    }

    const resp = await axios.get(downloadUrl, {
      responseType: "stream",
      timeout: 60000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
        Referer: "https://www.tiktok.com/",
      },
    });
    resp.data.path = "shoti_video.mp4";

    await api.sendMessage({ body: infoMsg, attachment: resp.data }, threadID, messageID);
  } catch (e) {
    await api.unsendMessage(spin.messageID).catch(() => {});
    api.sendMessage(`❌ Error: ${e.message}`, threadID, messageID);
  }
};
