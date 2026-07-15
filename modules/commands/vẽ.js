const fs = require("fs");
const axios = require("axios");
const path = require("path");

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

module.exports.config = {
  name: "vẽ",
  aliases: ['draw', 'text2img'],
  commandCategory: "Utility",
  description: "draw AI image",
  usages: "/vẽ [write whatever you want here]",
  hasPermssion: 0,
  cooldowns: 15,
  credits: "hmhung"
}

module.exports.run = async function ({ api, args, event, Users }) {
  let name = await Users.getNameUser(event.senderID);
  let mentions = [];
  mentions.push({
    tag: name,
    id: event.senderID
  });
  const prompt = args.join(" ");
  const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
  if (!prompt) return send("Missing something to fill in ¯\\_(ツ)_/¯");
  
  try {
    const response = await axios.get(`https://api.hamanhhung.site/ai/text2image?prompt=${encodeURI(prompt)}`);
    if (response.data.url) {
      const tenbien = await streamURL(response.data.url, 'jpg');
      send({
        body: `Here is the image "${prompt}" drawn as requested ${name} 💫`,
        attachment: tenbien,
        mentions
      });
    } 
  } catch (error) {
    send("An error has occurred :((");
    console.error(error); 
  }
}