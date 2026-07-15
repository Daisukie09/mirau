const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
    name: "addaccount",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Bot",
    description: "Create account for interaction management web login",
    commandCategory: "Admin",
    usages: "[render_url] - Generate code + password, enter Render URL",
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

    // Render URL from args or placeholder
    const renderUrl = args[0] || "https://your-app.onrender.com";

    try {
        const code = generateCode();
        const password = generateCode();

        // Save: code, password, render_url
        const content = `${code}\n${password}\n${renderUrl}`;
        fs.writeFileSync(codePath, content, "utf8");

        // Register with Render server if URL provided
        if (renderUrl && !renderUrl.includes('your-app')) {
            try {
                const axios = require('axios');
                await axios.post(`${renderUrl}/bot/register`, {
                    code,
                    password,
                    webhook: 'http://your-bot-ip:3002' // Bot webhook URL
                });
            } catch (e) {
                console.log('Render not reachable yet');
            }
        }

        return api.sendMessage(
            `[ WEB ACCOUNT CREATED ]\n` +
            `════════════════════\n\n` +
            `📋 CODE:\n${code}\n\n` +
            `🔐 PASSWORD:\n${password}\n\n` +
            `🌐 RENDER URL:\n${renderUrl}\n\n` +
            `════════════════════\n` +
            `📁 Saved to: code.txt\n` +
            `────────────────────\n` +
            `📌 RENDER DEPLOY GUIDE:\n\n` +
            `1️⃣ Create GitHub repo with webchecktuongtac folder\n\n` +
            `2️⃣ Go to render.com → New Web Service\n` +
            `   • Connect GitHub repo\n` +
            `   • Root: webchecktuongtac\n` +
            `   • Build: npm install\n` +
            `   • Start: npm start\n\n` +
            `3️⃣ After deploy, run again:\n` +
            `   ${global.config.PREFIX}addaccount https://xxx.onrender.com\n\n` +
            `4️⃣ Run ${global.config.PREFIX}webserver to enable webhook\n\n` +
            `5️⃣ Log into web with code + pass\n` +
            `────────────────────\n` +
            `⏰ ${time}`,
            threadID, messageID
        );

    } catch (error) {
        return api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
    }
};
