const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
    name: "webkick",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Bot",
    description: "Handle kick commands from web dashboard",
    commandCategory: "Admin",
    usages: "- Check and execute kicks from web",
    cooldowns: 5
};

const codePath = path.join(__dirname, "..", "..", "code.txt");

function getConfig() {
    try {
        if (fs.existsSync(codePath)) {
            const content = fs.readFileSync(codePath, "utf8");
            const lines = content.split('\n').filter(l => l.trim());
            return {
                code: lines[0]?.trim(),
                password: lines[1]?.trim(),
                webhook: lines[2]?.trim() || "http://localhost:3001"
            };
        }
    } catch (e) { }
    return null;
}

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;
    const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");

    const config = getConfig();
    if (!config) {
        return api.sendMessage(
            `⚠️ No account yet!\n📌 Use ${global.config.PREFIX}addaccount to create`,
            threadID, messageID
        );
    }

    try {
        // Get kick list from server
        const response = await axios.get(`${config.webhook}/bot/kicks?code=${config.code}`);
        const kicks = response.data.kicks || [];

        if (kicks.length === 0) {
            return api.sendMessage(
                `[ WEB KICK ]\n` +
                `────────────────────\n` +
                `📭 No kick commands from web\n` +
                `────────────────────\n` +
                `⏰ ${time}`,
                threadID, messageID
            );
        }

        let results = [];
        for (const kick of kicks) {
            try {
                // Send notification before kick
                await api.sendMessage(
`🚫 Kick from Web Dashboard\n` +
`👤 ${kick.memberName}\n` +
`📝 Requested by admin`,
                    kick.groupId
                );

                // Execute kick
                await api.removeUserFromGroup(kick.memberId, kick.groupId);
                results.push(`✅ ${kick.memberName}`);
            } catch (e) {
                results.push(`❌ ${kick.memberName}: ${e.message}`);
            }
        }

        return api.sendMessage(
            `[ WEB KICK ]\n` +
            `────────────────────\n` +
            `📊 Processed ${kicks.length} kick commands:\n` +
            results.join('\n') +
            `\n────────────────────\n` +
            `⏰ ${time}`,
            threadID, messageID
        );

    } catch (error) {
        return api.sendMessage(
            `❌ Error: ${error.message}`,
            threadID, messageID
        );
    }
};

// Auto check kick queue from web
module.exports.onLoad = function ({ api }) {
    // Check every 10 seconds
    setInterval(async () => {
        try {
            const config = getConfig();
            if (!config) return;

            const response = await axios.get(`${config.webhook}/bot/kicks?code=${config.code}`);
            const kicks = response.data.kicks || [];

            for (const kick of kicks) {
                try {
                    await api.sendMessage(
                        `🚫 Kick từ Web Dashboard\n` +
                        `👤 ${kick.memberName}\n` +
                        `📝 Requested by admin`,
                        kick.groupId
                    );
                    await api.removeUserFromGroup(kick.memberId, kick.groupId);
                    console.log(`[WEBKICK] Kicked ${kick.memberName} from ${kick.groupId}`);
                } catch (e) {
                    console.log(`[WEBKICK] Error: ${e.message}`);
                }
            }

            // Check load queue
            const loadRes = await axios.get(`${config.webhook}/bot/loads?code=${config.code}`);
            const loads = loadRes.data.loads || [];

            for (const load of loads) {
                // Trigger sync for this group
                console.log(`[WEBLOAD] Syncing group ${load.groupId}`);
            }

        } catch (e) {
            // Silent fail
        }
    }, 10000);
};
