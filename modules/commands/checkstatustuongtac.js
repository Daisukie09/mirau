const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
    name: "checkstatustuongtac",
    version: "1.0.0",
    hasPermssion: 2, // Admin bot only
    credits: "Bot",
    description: "View interaction tracking status of all groups",
    commandCategory: "Admin",
    usages: "- View list of groups with auto check interaction on/off",
    cooldowns: 5
};

const autoCheckPath = path.join(__dirname, "data", "autoCheckTuongTac.json");
const tuongtacDataPath = path.join(__dirname, "tuongtac_data");

// Read config data
function getAutoCheckData() {
    try {
        if (fs.existsSync(autoCheckPath)) {
            return JSON.parse(fs.readFileSync(autoCheckPath, "utf8"));
        }
    } catch (e) { }
    return { enabledThreads: {} };
}

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");

    const data = getAutoCheckData();
    const threads = Object.entries(data.enabledThreads);

    if (threads.length === 0) {
        return api.sendMessage(
            `[ INTERACTION STATUS ]\n` +
            `────────────────────\n` +
            `📭 No groups have been configured yet\n` +
            `────────────────────\n` +
            `📌 Use ${global.config.PREFIX}autochecktuongtac on\n` +
            `    in the group to enable tracking\n` +
            `────────────────────\n` +
            `⏰ ${time}`,
            threadID, messageID
        );
    }

    // Count enabled/disabled groups
    let enabledCount = 0;
    let disabledCount = 0;
    let enabledList = [];
    let disabledList = [];

    for (const [tid, info] of threads) {
        // Check if database file exists
        const dbPath = path.join(tuongtacDataPath, `${tid}.json`);
        const hasDB = fs.existsSync(dbPath);

        // Get member count if database exists
        let memberCount = 0;
        if (hasDB) {
            try {
                const dbData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
                memberCount = dbData.members?.length || 0;
            } catch (e) { }
        }

        // Get group name (if available)
        let threadName = tid;
        try {
            const threadInfo = await api.getThreadInfo(tid);
            threadName = threadInfo.name || tid;
        } catch (e) { }

        if (info.enabled) {
            enabledCount++;
            enabledList.push({
                id: tid,
                name: threadName,
                enabledBy: info.enabledByName || info.enabledBy,
                enabledAt: info.enabledAt,
                memberCount: memberCount,
                hasDB: hasDB
            });
        } else {
            disabledCount++;
            disabledList.push({
                id: tid,
                name: threadName,
                disabledBy: info.disabledByName || info.disabledBy,
                disabledAt: info.disabledAt
            });
        }
    }

    // Build output
    let message = `[ INTERACTION STATUS ]\n`;
    message += `────────────────────\n`;
    message += `📊 Total: ${threads.length} groups\n`;
    message += `✅ Enabled: ${enabledCount}\n`;
    message += `❌ Disabled: ${disabledCount}\n`;
    message += `────────────────────\n`;

    if (enabledList.length > 0) {
        message += `\n📗 ENABLED GROUPS:\n`;
        for (let i = 0; i < enabledList.length; i++) {
            const g = enabledList[i];
            message += `${i + 1}. ${g.name}\n`;
            message += `   👥 ${g.memberCount} members\n`;
            message += `   👤 Enabled by: ${g.enabledBy}\n`;
            message += `   ⏰ ${g.enabledAt}\n`;
        }
    }

    if (disabledList.length > 0) {
        message += `\n📕 DISABLED GROUPS:\n`;
        for (let i = 0; i < disabledList.length; i++) {
            const g = disabledList[i];
            message += `${i + 1}. ${g.name}\n`;
            message += `   👤 Disabled by: ${g.disabledBy || "N/A"}\n`;
            message += `   ⏰ ${g.disabledAt || "N/A"}\n`;
        }
    }

    message += `\n────────────────────\n`;
    message += `⏰ Updated: ${time}`;

    return api.sendMessage(message, threadID, messageID);
};
