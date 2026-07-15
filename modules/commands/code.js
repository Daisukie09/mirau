const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
  name: "code",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Bot",
  description: "Create code.txt file to connect to web dashboard",
  commandCategory: "Admin",
  usages: "[render_url] - Generate web login code",
  cooldowns: 10
};

const codePath = path.join(__dirname, "..", "..", "code.txt");

function generateCode() {
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");

  const renderUrl = args[0] || "https://your-app.onrender.com";

  try {
    const code = generateCode();
    const password = generateCode();

    // Format: code, password, renderUrl
    const content = `${code}\n${password}\n${renderUrl}`;
    fs.writeFileSync(codePath, content, "utf8");

    // Register with Render
    if (renderUrl && !renderUrl.includes('your-app')) {
      try {
        const axios = require('axios');
        await axios.post(`${renderUrl}/bot/register`, { code, password });
        console.log('[CODE] Registered');
      } catch (e) { }
    }

    return api.sendMessage(
      `[ GENERATE CODE ]\n` +
      `════════════════════\n\n` +
      `📋 CODE: ${code}\n` +
      `🔐 PASS: ${password}\n\n` +
      `════════════════════\n` +
      `🌐 Render: ${renderUrl}\n` +
      `════════════════════\n\n` +
      `📌 HOW TO USE:\n\n` +
      `1️⃣ Deploy webchecktuongtac to Render\n\n` +
      `2️⃣ Get URL (e.g. https://abc.onrender.com)\n\n` +
      `3️⃣ Run again:\n` +
      `   ${global.config.PREFIX}code https://abc.onrender.com\n\n` +
      `4️⃣ Enable auto sync:\n` +
      `   ${global.config.PREFIX}websync on\n\n` +
      `5️⃣ Login to web with CODE + PASS\n` +
      `────────────────────\n` +
      `⏰ ${time}`,
      threadID, messageID
    );

  } catch (error) {
    return api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
  }
};