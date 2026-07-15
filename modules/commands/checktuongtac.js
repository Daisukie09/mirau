const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
    name: "checktuongtac",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Bot",
    description: "View interaction count of all members in the group",
    commandCategory: "User",
    usages: "- Display day/week interactions of all members",
    cooldowns: 3
};

const tuongtacDataPath = path.join(__dirname, "tuongtac_data");
const autoCheckPath = path.join(__dirname, "data", "autoCheckTuongTac.json");

// Read auto check config data
function getAutoCheckData() {
    try {
        if (fs.existsSync(autoCheckPath)) {
            return JSON.parse(fs.readFileSync(autoCheckPath, "utf8"));
        }
    } catch (e) { }
    return { enabledThreads: {} };
}

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

// Save group data
function saveGroupData(threadID, data) {
    const filePath = path.join(tuongtacDataPath, `${threadID}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");
}

// Full sync: add new + remove leavers
async function fullSyncMembers(api, threadID, groupData) {
    try {
        const threadInfo = await api.getThreadInfo(threadID);
        const currentMemberIDs = threadInfo.participantIDs || [];
        const existingIDs = groupData.members.map(m => m.id);

        // Remove members who left the group
        const originalCount = groupData.members.length;
        groupData.members = groupData.members.filter(m => currentMemberIDs.includes(m.id));
        const removedCount = originalCount - groupData.members.length;

        // Add new members
        const afterRemoveIDs = groupData.members.map(m => m.id);
        const newMemberIDs = currentMemberIDs.filter(id => !afterRemoveIDs.includes(id));

        for (const id of newMemberIDs) {
            groupData.members.push({
                id: id,
                day: 0,
                week: 0,
                total: 0,
                lastInteract: null
            });
        }

        // Save
        groupData.lastSync = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");
        saveGroupData(threadID, groupData);

        return {
            removedCount,
            addedCount: newMemberIDs.length,
            totalCount: groupData.members.length
        };
    } catch (e) {
        return { removedCount: 0, addedCount: 0, totalCount: groupData.members.length, error: e.message };
    }
}

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");

    const autoCheckData = getAutoCheckData();
    const isEnabled = autoCheckData.enabledThreads[threadID]?.enabled || false;

    let groupData = getGroupData(threadID);

    if (!groupData) {
        return api.sendMessage(
            `[ CHECK INTERACTION ]\n` +
            `────────────────────\n` +
            `⚠️ No database for this group yet!\n` +
            `📌 Use ${global.config.PREFIX}autochecktuongtac on\n` +
            `────────────────────\n` +
            `⏰ ${time}`,
            threadID, messageID
        );
    }

    // SYNC: Add new + Remove leavers
    const syncResult = await fullSyncMembers(api, threadID, groupData);

    // Re-read after sync
    groupData = getGroupData(threadID);
    const members = groupData.members || [];

    if (members.length === 0) {
        return api.sendMessage(`⚠️ No members in the database`, threadID, messageID);
    }

    // Sort by day descending
    const sortedMembers = [...members].sort((a, b) => (b.day || 0) - (a.day || 0));

    // Build list
    let lines = [];
    for (let i = 0; i < sortedMembers.length; i++) {
        const m = sortedMembers[i];
        const userName = global.data.userName.get(m.id) || "User";
        const lastTime = m.lastInteract || "-";
        lines.push(`${i + 1}. ${userName} | Day: ${m.day || 0} | Week: ${m.week || 0} | Last: ${lastTime}`);
    }

    const statusText = isEnabled ? "✅ BẬT" : "❌ TẮT";

    // Sync notification
    let syncMsg = "";
    if (syncResult.addedCount > 0 || syncResult.removedCount > 0) {
        syncMsg = `🔄 Sync: +${syncResult.addedCount} new, -${syncResult.removedCount} left\n`;
    }

    const message =
        `[ GROUP INTERACTION ]\n` +
        `────────────────────\n` +
        syncMsg +
        lines.join('\n') +
        `\n────────────────────\n` +
        `👥 Total: ${members.length} | Auto: ${statusText}\n` +
        `⏰ ${time}`;

    return api.sendMessage(message, threadID, messageID);
};
