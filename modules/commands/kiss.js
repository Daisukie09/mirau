const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "kiss",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Bot",
    description: "Kiss someone!",
    commandCategory: "Image",
    usages: "@mention",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs": "",
        "path": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const mentions = Object.keys(event.mentions);
    if (mentions.length === 0) return api.sendMessage("Please tag the person you want to kiss!", threadID, messageID);

    const targetID = mentions[0];
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const imgPath = path.join(cacheDir, `kiss_${Date.now()}.png`);

    try {
        const response = await axios({
            method: 'get',
            url: `https://betadash-api-swordslush-production.up.railway.app/kiss?userid1=${senderID}&userid2=${targetID}`,
            responseType: 'arraybuffer'
        });
        fs.writeFileSync(imgPath, Buffer.from(response.data));
        api.sendMessage({
            body: `💋`,
            attachment: fs.createReadStream(imgPath)
        }, threadID, () => fs.unlink(imgPath, () => {}), messageID);
    } catch (err) {
        console.error("Kiss error:", err.message);
        api.sendMessage("❌ An error occurred!", threadID, messageID);
        if (fs.existsSync(imgPath)) fs.unlink(imgPath, () => {});
    }
};
