const axios = require('axios');
const path = require('path');
const fs = require('fs');
const limit = 6

function streamURL(url, type) {
  return axios.get(url, {
    responseType: 'arraybuffer'
  }).then(res => {
    const filePath = path.join(__dirname, `/cache/${Date.now()}.${type}`);
    fs.writeFileSync(filePath, res.data);
    setTimeout(() => fs.unlinkSync(filePath), 1000 * 60);
    return fs.createReadStream(filePath);
  });
}

module.exports = {
  config: {
    name: "tiksearch",
    aliases: ["tsearch"],
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Hà Mạnh Hùng",
    description: "Search TikTok videos by keyword and select by number",
    commandCategory: "Utilities",
    usages: "Usage: /tiksearch <keyword>",
    cooldowns: 5,
    images: [],
  },

  run: async ({ event, api, args }) => {
    try {
      if (!args[0]) {
        return api.sendMessage("Please enter a keyword to search TikTok videos!", event.threadID, event.messageID);
      }

      const keyword = args.join(" ");
      const response = await axios.get(`https://api.hamanhhung.site/other/tiktoksearch?keyword=${keyword}&limit=${limit}`);
      const data = response.data.result;

      if (!data || !data.length) {
        return api.sendMessage("No results found for the keyword.", event.threadID, event.messageID);
      }

      let message = `Search results for keyword "${keyword}":\n\n`;
      data.slice(0, limit).forEach((video, index) => {
        message += `${index + 1}. Title: ${video.desc}\n`;
        message += `Views: ${video.stats.playCount}\n`;
        message += `Posted by: ${video.author.nickname} (@${video.author.uniqueId})\n\n`;
      });
      message += "Please reply with the number of the video you want to select.";

      api.sendMessage(message, event.threadID, (err, info) => {
        if (err) return console.error(err);

        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          videos: data.slice(0, limit),
          originalMessageID: event.messageID
        });
      }, event.messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while searching TikTok videos.", event.threadID, event.messageID);
    }
  },

  handleReply: async ({ event, api, handleReply }) => {
    try {
      const choice = parseInt(event.body);
      const selectedVideo = handleReply.videos[choice - 1];

      if (!selectedVideo) {
        return api.sendMessage("Invalid number, please choose again!", event.threadID, event.messageID);
      }
      if (event.senderID !== handleReply.author) {
      api.sendMessage("Who are you???", event.threadID, event.messageID); 
      return api.setMessageReaction("😕", event.messageID, () => {}, true);
  }

      const json = await infoPostTT(`https://www.tiktok.com/video/${selectedVideo.id}`);
      api.unsendMessage(handleReply.messageID);
      return api.sendMessage({
        body: `•👤 Channel Name: ${json.author.nickname}\n` +
              `•😽 User ID: ${json.author.unique_id}\n` +
              `•🌐 Country: ${json.region}\n` +
              `•💬 Title: ${json.title}\n` +
              `•❤️ Likes: ${json.digg_count}\n` +
              `•👁‍🗨 Views: ${json.play_count}\n` +
              `•💭 Comments: ${json.comment_count}\n` +
              `•🔗 Shares: ${json.share_count}\n` +
              `•⏰ Duration: ${json.duration}s\n` +
              `•📥 Downloads: ${json.download_count}\n` +
              `•React "❤" to download music`,
        attachment: await streamURL(json.play, 'mp4')
      }, event.threadID, (error, info) => {
        global.client.handleReaction.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          data: json
        });
      }, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while processing your selection.", event.threadID, event.messageID);
    }
  },

  handleReaction: async function (o) {
    const { threadID: t, messageID: m, reaction: r } = o.event;
    const h = global.client.handleReaction.find(e => e.messageID == m);

    if (!h || r !== "❤") return;

    o.api.sendMessage({
      body: `
====『 MUSIC TIKTOK 』====
▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱
👤 ID: ${h.data.music_info.id}
💬 Title: ${h.data.music_info.title}
🔗 Link: ${h.data.music_info.play}
⏱️ Duration: ${h.data.music_info.duration}
▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱`,
      attachment: await streamURL(h.data.music, "mp3")
    }, t, m);
  }
};

async function infoPostTT(url) {
  return axios({
    method: 'post',
    url: `https://tikwm.com/api/`,
    data: {
      url
    },
    headers: {
      'content-type': 'application/json'
    }
  }).then(res => res.data.data);
}