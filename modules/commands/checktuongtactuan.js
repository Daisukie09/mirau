const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
    name: "checktuongtactuan",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Bot",
    description: "View members with weekly interaction greater than input",
    commandCategory: "User",
    usages: "[number] - Filter members with weekly interaction > input",
    cooldowns: 3
};

const tuongtacDataPath = path.join(__dirname, "tuongtac_data");

// Read interaction data of the group
function getGroupData(threadID) {
    const filePath = path.join(tuongtacDataPath, `${threadID}.json`);
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, "utf8"));
        }
    } catch (e) { }
    return null;
}

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");

    // Get number to filter
    const minCount = parseInt(args[0]) || 0;

    // Read interaction data
    const groupData = getGroupData(threadID);

    if (!groupData) {
        return api.sendMessage(
            `⚠️ No database for this group yet!\n` +
            `📌 Use ${global.config.PREFIX}autochecktuongtac on to create`,
            threadID, messageID
        );
    }

    const members = groupData.members || [];

    // Filter members with weekly interaction > minCount
    const filtered = members.filter(m => (m.week || 0) > minCount);

    if (filtered.length === 0) {
        return api.sendMessage(
            `[ WEEKLY INTERACTION > ${minCount} ]\n` +
            `────────────────────\n` +
            `📭 No members have\n` +
            `    weekly interaction > ${minCount}\n` +
            `────────────────────\n` +
            `⏰ ${time}`,
            threadID, messageID
        );
    }

    // Sort descending
    const sorted = filtered.sort((a, b) => (b.week || 0) - (a.week || 0));

    // Build list
    let lines = [];
    let count = 1;

    for (const member of sorted) {
        let userName = global.data.userName.get(member.id) || "User";
        const lastTime = member.lastInteract || "-";
        lines.push(`${count}. ${userName} | Week: ${member.week || 0} | Last: ${lastTime}`);
        count++;
    }

    const message =
        `[ WEEKLY INTERACTION > ${minCount} ]\n` +
        `────────────────────\n` +
        `👥 Found: ${filtered.length} members\n` +
        `────────────────────\n` +
        lines.join('\n') +
        `\n────────────────────\n` +
        `⏰ ${time}`;

    return api.sendMessage(message, threadID, messageID);
};
