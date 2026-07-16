const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "loli",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Bot",
    description: "Send random loli image",
    commandCategory: "Image",
    usages: "[loli]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs": "",
        "path": ""
    }
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const imgPath = path.join(cacheDir, `loli_${Date.now()}.png`);

    try {
        const response = await axios({
            method: 'get',
            url: 'https://betadash-api-swordslush-production.up.railway.app/loli',
            responseType: 'arraybuffer'
        });
        fs.writeFileSync(imgPath, Buffer.from(response.data));
        api.sendMessage({
            body: "Here's your loli image!",
            attachment: fs.createReadStream(imgPath)
        }, threadID, () => fs.unlink(imgPath, () => {}), messageID);
    } catch (err) {
        console.error("Loli error:", err.message);
        api.sendMessage("❌ An error occurred while fetching the image!", threadID, messageID);
        if (fs.existsSync(imgPath)) fs.unlink(imgPath, () => {});
    }
};
