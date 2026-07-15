const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
    name: "syncweb",
    version: "1.0.0",
    hasPermssion: 2, // Admin bot only
    credits: "Bot",
    description: "Sync interaction data to web",
    commandCategory: "Admin",
    usages: "- Send enabled groups' data to web server",
    cooldowns: 5
};

const codePath = path.join(__dirname, "..", "..", "code.txt");
const autoCheckPath = path.join(__dirname, "data", "autoCheckTuongTac.json");
const tuongtacDataPath = path.join(__dirname, "tuongtac_data");

// Read config
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

// Read enabled groups list
function getEnabledGroups() {
    try {
        if (fs.existsSync(autoCheckPath)) {
            const data = JSON.parse(fs.readFileSync(autoCheckPath, "utf8"));
            return data.enabledThreads || {};
        }
    } catch (e) { }
    return {};
}

// Read member data
function getGroupMembers(threadID) {
    const filePath = path.join(tuongtacDataPath, `${threadID}.json`);
    try {
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
            return data.members || [];
        }
    } catch (e) { }
    return [];
}

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;
    const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");

// Read config
    const config = getConfig();
    if (!config) {
        return api.sendMessage(
            `⚠️ No account yet!\n📌 Use ${global.config.PREFIX}addaccount to create`,
            threadID, messageID
        );
    }

    try {
        // Get group data
        const enabledGroups = getEnabledGroups();
        const groups = {};
        const members = {};

        for (const [gid, info] of Object.entries(enabledGroups)) {
            if (info.enabled) {
                // Get group name
                let groupName = gid;
                try {
                    const threadInfo = await api.getThreadInfo(gid);
                    groupName = threadInfo.name || gid;
                } catch (e) { }

                groups[gid] = {
                    name: groupName,
                    enabledAt: info.enabledAt,
                    enabledByName: info.enabledByName || info.enabledBy
                };

                // Get members
                const memberList = getGroupMembers(gid);
                members[gid] = memberList.map(m => ({
                    id: m.id,
                    name: global.data.userName.get(m.id) || "User",
                    day: m.day || 0,
                    week: m.week || 0,
                    total: m.total || 0,
                    lastInteract: m.lastInteract || "-"
                }));

                groups[gid].memberCount = memberList.length;
            }
        }

        // Send to server
        await axios.post(`${config.webhook}/bot/update`, {
            code: config.code,
            groups: groups,
            members: members
        });

        return api.sendMessage(
            `[ SYNC WEB ]\n` +
            `────────────────────\n` +
            `✅ Synced to web!\n` +
            `📊 Groups: ${Object.keys(groups).length}\n` +
            `🌐 URL: ${config.webhook}\n` +
            `────────────────────\n` +
            `⏰ ${time}`,
            threadID, messageID
        );

    } catch (error) {
        return api.sendMessage(
            `❌ Sync error: ${error.message}\n\n` +
            `📌 Make sure the web server is running:\n` +
            `cd webchecktuongtac && npm start`,
            threadID, messageID
        );
    }
};

// Auto sync every 60 seconds (if handleEvent exists)
module.exports.handleEvent = async function ({ api, event }) {
    // No need to handle events here
};
