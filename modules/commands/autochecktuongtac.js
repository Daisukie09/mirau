const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
    name: "autochecktuongtac",
    version: "1.0.0",
    hasPermssion: 1, // Group admin
    credits: "Bot",
    description: "Turn on/off special interaction tracking mode for group",
    commandCategory: "Group Admin",
    usages: "[on/off] - Turn on or off interaction tracking mode",
    cooldowns: 3
};

const dataPath = path.join(__dirname, "data", "autoCheckTuongTac.json");
const tuongtacDataPath = path.join(__dirname, "tuongtac_data");

// Ensure file and folder exist
function ensureDataFile() {
    const dir = path.dirname(dataPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(dataPath, JSON.stringify({ enabledThreads: {} }, null, 4));
    }
    if (!fs.existsSync(tuongtacDataPath)) {
        fs.mkdirSync(tuongtacDataPath, { recursive: true });
    }
}

// Read data
function getData() {
    ensureDataFile();
    try {
        return JSON.parse(fs.readFileSync(dataPath, "utf8"));
    } catch (e) {
        return { enabledThreads: {} };
    }
}

// Save data
function saveData(data) {
    ensureDataFile();
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 4), "utf8");
}

// Create database for group
async function createGroupDatabase(api, threadID, senderID) {
    const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");
    const groupDataPath = path.join(tuongtacDataPath, `${threadID}.json`);

    // Skip if already exists
    if (fs.existsSync(groupDataPath)) {
        return JSON.parse(fs.readFileSync(groupDataPath, "utf8"));
    }

    // Lấy thông tin nhóm
    let participantIDs = [senderID];
    try {
        const threadInfo = await api.getThreadInfo(threadID);
        participantIDs = threadInfo.participantIDs || [senderID];
    } catch (e) { }

    // Create new database
    const newDatabase = {
        threadID: threadID,
        createdAt: time,
        createdBy: senderID,
        members: participantIDs.map(id => ({
            id: id,
            day: 0,
            week: 0,
            total: 0,
            lastInteract: null
        })),
        lastReset: {
            day: moment.tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD"),
            week: moment.tz("Asia/Ho_Chi_Minh").isoWeek()
        }
    };

    fs.writeFileSync(groupDataPath, JSON.stringify(newDatabase, null, 4), "utf8");
    return newDatabase;
}

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");

    // Get username
    let senderName = "User";
    try {
        const userInfo = await api.getUserInfo(senderID);
        senderName = userInfo[senderID]?.name || global.data.userName.get(senderID) || "User";
    } catch (e) {
        senderName = global.data.userName.get(senderID) || "User";
    }

    // Check parameter
    const option = args[0]?.toLowerCase();

    if (!option || (option !== "on" && option !== "off")) {
        // Show current status
        const data = getData();
        const isEnabled = data.enabledThreads[threadID]?.enabled || false;
        const statusText = isEnabled ? "✅ ON" : "❌ OFF";

        return api.sendMessage(
            `[ AUTO CHECK INTERACTION ]\n` +
            `────────────────────\n` +
            `📊 Current status: ${statusText}\n` +
            `────────────────────\n` +
            `📌 Usage guide:\n` +
            `• ${global.config.PREFIX}autochecktuongtac on - Enable tracking\n` +
            `• ${global.config.PREFIX}autochecktuongtac off - Disable tracking\n` +
            `────────────────────\n` +
            `⏰ Time: ${time}`,
            threadID, messageID
        );
    }

    const data = getData();

    if (option === "on") {
        // Create database for group
        const groupDB = await createGroupDatabase(api, threadID, senderID);
        const memberCount = groupDB.members?.length || 0;

        // Enable tracking mode
        data.enabledThreads[threadID] = {
            enabled: true,
            enabledBy: senderID,
            enabledByName: senderName,
            enabledAt: time
        };
        saveData(data);

        return api.sendMessage(
            `[ AUTO CHECK INTERACTION ]\n` +
            `────────────────────\n` +
            `✅ Interaction tracking ENABLED\n` +
            `📊 Database has been created/updated\n` +
            `👥 Member count: ${memberCount}\n` +
            `────────────────────\n` +
            `💬 All messages will be counted in:\n` +
            `   • Daily counter\n` +
            `   • Weekly counter\n` +
            `────────────────────\n` +
            `📁 File: tuongtac_data/${threadID}.json\n` +
            `👤 Enabled by: ${senderName}\n` +
            `⏰ Time: ${time}\n` +
            `────────────────────\n` +
            `📌 Use ${global.config.PREFIX}checktuongtac to view stats`,
            threadID, messageID
        );
    } else if (option === "off") {
        // Disable tracking mode (don't delete database)
        if (data.enabledThreads[threadID]) {
            data.enabledThreads[threadID].enabled = false;
            data.enabledThreads[threadID].disabledBy = senderID;
            data.enabledThreads[threadID].disabledByName = senderName;
            data.enabledThreads[threadID].disabledAt = time;
        }
        saveData(data);

        return api.sendMessage(
            `[ AUTO CHECK INTERACTION ]\n` +
            `────────────────────\n` +
            `❌ Interaction tracking DISABLED\n` +
            `📊 Data is preserved\n` +
            `────────────────────\n` +
            `👤 Disabled by: ${senderName}\n` +
            `⏰ Time: ${time}`,
            threadID, messageID
        );
    }
};

// Save interaction on message
module.exports.handleEvent = async function ({ event }) {
    if (!event.isGroup) return;

    const { threadID, senderID } = event;
    const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");

    try {
        // Check if group has auto check enabled
        const data = getData();
        if (!data.enabledThreads[threadID]?.enabled) return;

        // Đường dẫn database nhóm
        const groupDataPath = path.join(tuongtacDataPath, `${threadID}.json`);
        if (!fs.existsSync(groupDataPath)) return;

        // Đọc database
        let groupDB = JSON.parse(fs.readFileSync(groupDataPath, "utf8"));

        // Check day/week reset
        const today = moment.tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD");
        const currentWeek = moment.tz("Asia/Ho_Chi_Minh").isoWeek();

        // Reset day if needed
        if (groupDB.lastReset.day !== today) {
            groupDB.members.forEach(m => m.day = 0);
            groupDB.lastReset.day = today;
        }

        // Reset week if needed
        if (groupDB.lastReset.week !== currentWeek) {
            groupDB.members.forEach(m => m.week = 0);
            groupDB.lastReset.week = currentWeek;
        }

        // Find or add member
        let member = groupDB.members.find(m => m.id === senderID);
        if (!member) {
            member = {
                id: senderID,
                day: 0,
                week: 0,
                total: 0,
                lastInteract: null
            };
            groupDB.members.push(member);
        }

        // Update interaction
        member.day++;
        member.week++;
        member.total++;
        member.lastInteract = time;

        // Save database
        fs.writeFileSync(groupDataPath, JSON.stringify(groupDB, null, 4), "utf8");

    } catch (e) {
        // Silent fail
    }
};
