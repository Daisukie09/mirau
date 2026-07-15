const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "lo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Bot",
  description: "Send random lo che o image",
  commandCategory: "User",
  usages: "[lo/locheo]",
  cooldowns: 5
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body } = event;

  if (!body) return;
  const lowerBody = body.toLowerCase().trim();

  // Check if the message is "lo", "locheo", "lọ", "lọ chéo", etc.
  const validCommands = ["lo", "locheo", "lọ", "lọ chéo", "lọ cheo", "lo chéo", "lo cheo"];
  if (validCommands.includes(lowerBody)) {
    const imageDir = path.join(__dirname, 'data', 'locheo');

    try {
      // Read all images in the directory
      const files = fs.readdirSync(imageDir).filter(file =>
        ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase())
      );

      if (files.length === 0) {
        return api.sendMessage("❌ No images in the collection!", threadID, messageID);
      }

      // Pick 1 random image
      const randomFile = files[Math.floor(Math.random() * files.length)];
      const attachment = fs.createReadStream(path.join(imageDir, randomFile));

      return api.sendMessage({
        body: "🔥 Here's your lo che o image! 🔥",
        attachment: attachment
      }, threadID, messageID);

    } catch (error) {
      console.error('Error sending locheo image:', error);
      return api.sendMessage("❌ An error occurred while getting the image!", threadID, messageID);
    }
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  const imageDir = path.join(__dirname, 'data', 'locheo');

  try {
    // Read all images in the directory
    const files = fs.readdirSync(imageDir).filter(file =>
      ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase())
    );

    if (files.length === 0) {
      return api.sendMessage("❌ No images in the collection!", threadID, messageID);
    }

    // Pick 1 random image
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const attachment = fs.createReadStream(path.join(imageDir, randomFile));

    return api.sendMessage({
      body: "🔥 Here's your lo che o image! 🔥",
      attachment: attachment
    }, threadID, messageID);

  } catch (error) {
    console.error('Error sending locheo image:', error);
    return api.sendMessage("❌ An error occurred while getting the image!", threadID, messageID);
  }
};
