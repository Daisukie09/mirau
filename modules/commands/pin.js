const axios = require("axios");

let streamURL = (url, ext = 'jpg') => require('axios').get(url, {
  responseType: 'stream',
}).then(res => (res.data.path = `tmp.${ext}`, res.data)).catch(e => null);

const PINTEREST_REGEX = /(https:\/\/(www.)?(pinterest.com|pin.it)[^ \n]*)/g;

const downloadImages = async (url, api, event) => {
  try {
    const match = PINTEREST_REGEX.exec(url);
    if (!match) {
      api.sendMessage("❎ Invalid Pinterest post URL", event.threadID, event.messageID);
      return;
    }

    const res = await axios.get(`https://api.imgbb.com/1/upload?key=588779c93c7187148b4fa9b7e9815da9&image=${match[0]}`);
    api.sendMessage({ body: "[ PINTEREST - DOWNLOAD ]\n────────────────\n\n📎 Url: " + res.data.data.image.url, attachment: await streamURL(res.data.data.image.url, 'jpg') }, event.threadID);
  } catch (error) {
    api.sendMessage("❎ An error occurred while downloading image", event.threadID, event.messageID);
  }
};

const searchPinterest = async (query, api, event) => {
  try {
    const [keyword, limitStr] = query.split('-').map(str => str.trim());

    if (!keyword) {
      return api.sendMessage('⚠️ Please enter a keyword to search 🔎', event.threadID, event.messageID);
    }

    const limit = !isNaN(limitStr) ? parseInt(limitStr) : null;

    if (limit && (limit <= 0 || limit > 50)) {
      return api.sendMessage('⚠️ You can only search up to 50 images', event.threadID, event.messageID);
    }

    const pinter = require('./../../includes/datajson/pinter.js');
    pinter(keyword).then(async (data) => {
      const results = data.data.slice(0, limit);
      const imagePromises = Array.from({ length: limit }, async (_, i) => {
        const a = results[i];
        try {
          const stream = (await axios.get(a, { responseType: "stream" })).data;
          return stream;
        } catch (error) {
          return null;
        }
      });

      const image = await Promise.all(imagePromises);

      api.sendMessage({
        body: `[ PINTEREST - SEARCH ]\n────────────────\n\n📝 Found ${results.length} image search results on pinterest for keyword: ${keyword} 🌸\n` + (limit && limit > results.length ? `❎ Error loading ${limit - results.length} images` : ""),
        attachment: image.filter(img => img !== null)
      }, event.threadID, event.messageID);
    }).catch(e => {
      api.sendMessage("❎ An error occurred while searching on Pinterest", event.threadID, event.messageID);
    });
  } catch (error) {
    api.sendMessage("❎ An error occurred while searching on Pinterest", event.threadID, event.messageID);
  }
};

module.exports.config = {
  name: "pin",
  version: "2.0.0",
  hasPermission: 0,
  credits: "Trịnh Đình Phát",
  description: "Download video or search images on Pinterest",
  commandCategory: "Utility",
  usages: "pinterest down {url} | pinterest search {keyword}",
  cooldowns: 5,
  usePrefix: false,
  images: [
    "https://i.imgur.com/ukt4Qmr.jpeg",
    "https://i.imgur.com/yTdSIzp.jpeg"
  ],
};

module.exports.run = async function ({ api, event, args }) {
  const p = global.config.PREFIX;

  switch (args[0]) {
    case "dl":
    case "down":
      await downloadImages(args[1], api, event);
      break;

    case "s":
    case "search":
      await searchPinterest(args.slice(1).join(" "), api, event);
      break;

    default:
      const helpMessage = `[ PINTEREST ]\n────────────────\n\n📝 You can use:\n→⁠ pinterest search/s: search keyword - number of images\n→⁠ pinterest down/dl + link: download image/video with link`;
      const attachment = (await axios.get(`https://i.imgur.com/blbLKG3.jpeg`, { responseType: "stream" })).data;
      api.sendMessage({ body: helpMessage, attachment }, event.threadID, event.messageID);
      break;
  }
};
