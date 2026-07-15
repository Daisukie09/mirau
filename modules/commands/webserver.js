const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');

module.exports.config = {
    name: "webserver",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Bot",
    description: "Start webhook server to receive commands from web",
    commandCategory: "Admin",
    usages: "[port] - Start webhook server (default: 3002)",
    cooldowns: 10
};

const codePath = path.join(__dirname, "..", "..", "code.txt");
const autoCheckPath = path.join(__dirname, "data", "autoCheckTuongTac.json");
const tuongtacDataPath = path.join(__dirname, "tuongtac_data");

let serverInstance = null;
let botApi = null;
let activeSessions = {}; // { code: lastPingTime }

// Read config
function getConfig() {
    try {
        if (fs.existsSync(codePath)) {
            const lines = fs.readFileSync(codePath, "utf8").split('\n').filter(l => l.trim());
            return {
                code: lines[0]?.trim(),
                password: lines[1]?.trim(),
                renderUrl: lines[2]?.trim(),
                botWebhook: lines[3]?.trim()
            };
        }
    } catch (e) { }
    return null;
}

// Check active session (within 6 minutes)
function isSessionActive(code) {
    const lastPing = activeSessions[code];
    if (!lastPing) return false;
    return (Date.now() - lastPing) < 6 * 60 * 1000;
}

// Read group list
function getEnabledGroups() {
    try {
        if (fs.existsSync(autoCheckPath)) {
            return JSON.parse(fs.readFileSync(autoCheckPath, "utf8")).enabledThreads || {};
        }
    } catch (e) { }
    return {};
}

// Read group members
function getGroupMembers(threadID) {
    const filePath = path.join(tuongtacDataPath, `${threadID}.json`);
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, "utf8")).members || [];
        }
    } catch (e) { }
    return [];
}

function saveGroupData(threadID, data) {
    const filePath = path.join(tuongtacDataPath, `${threadID}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");
}

// Create server
function createServer(api, port) {
    const app = express();
    app.use(express.json());

    // ========== UPTIME ROBOT / HEALTH CHECK ==========
    app.get('/ping', (req, res) => {
        res.json({
            status: 'ok',
            bot: 'online',
            uptime: process.uptime(),
            time: moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY")
        });
    });

    app.get('/health', (req, res) => {
        res.json({
            status: 'ok',
            activeSessions: Object.keys(activeSessions).filter(c => isSessionActive(c)).length
        });
    });

    // ========== WEB CONNECT/DISCONNECT ==========
    app.post('/web/connect', (req, res) => {
        const { code, action } = req.body;
        const config = getConfig();

        if (config?.code !== code) {
            return res.json({ success: false });
        }

        activeSessions[code] = Date.now();
        console.log(`[WEBSERVER] ${action || 'connect'} - Code: ${code}`);
        res.json({ success: true, message: 'Connected' });
    });

    app.post('/web/disconnect', (req, res) => {
        const { code } = req.body;
        delete activeSessions[code];
        console.log(`[WEBSERVER] Disconnected - Code: ${code}`);
        res.json({ success: true });
    });

    // Ping to keep connection alive (from server every 5 minutes)
    app.post('/web/ping', (req, res) => {
        const { code, timestamp } = req.body;
        const config = getConfig();

        if (config?.code !== code) {
            return res.json({ success: false });
        }

        activeSessions[code] = Date.now();
        res.json({ success: true, active: true });
    });

    // ========== SYNC DATA ==========
    app.post('/web/sync', async (req, res) => {
        const { code } = req.body;
        const config = getConfig();

        if (config?.code !== code) {
            return res.json({ success: false });
        }

        // Update session
        activeSessions[code] = Date.now();

        try {
            const enabledGroups = getEnabledGroups();
            const groups = {};
            const members = {};

            for (const [gid, info] of Object.entries(enabledGroups)) {
                if (info.enabled) {
                    let groupName = gid;
                    try {
                        const threadInfo = await api.getThreadInfo(gid);
                        groupName = threadInfo.name || gid;
                    } catch (e) { }

                    const memberList = getGroupMembers(gid);

                    groups[gid] = {
                        name: groupName,
                        memberCount: memberList.length,
                        enabledAt: info.enabledAt,
                        enabledByName: info.enabledByName
                    };

                    members[gid] = memberList.map(m => ({
                        id: m.id,
                        name: global.data.userName.get(m.id) || "User",
                        day: m.day || 0,
                        week: m.week || 0,
                        total: m.total || 0,
                        lastInteract: m.lastInteract || "-"
                    }));
                }
            }

            console.log(`[WEBSERVER] Synced ${Object.keys(groups).length} groups`);
            res.json({ success: true, groups, members });
        } catch (e) {
            res.json({ success: false, message: e.message });
        }
    });

    // ========== KICK ==========
    app.post('/web/kick', async (req, res) => {
        const { code, groupId, memberId, memberName } = req.body;
        const config = getConfig();

        if (config?.code !== code) {
            return res.json({ success: false, message: 'Invalid code' });
        }

        try {
            await api.sendMessage(
                `🚫 KICK FROM WEB\n` +
                `────────────────\n` +
                `👤 ${memberName}\n` +
                `⏰ ${moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY")}`,
                groupId
            );

            await api.removeUserFromGroup(memberId, groupId);

            // Remove from database
            const dbPath = path.join(tuongtacDataPath, `${groupId}.json`);
            if (fs.existsSync(dbPath)) {
                const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));
                data.members = data.members.filter(m => m.id !== memberId);
                saveGroupData(groupId, data);
            }

            console.log(`[WEBSERVER] Kicked ${memberName} from ${groupId}`);
            res.json({ success: true, message: `Kicked ${memberName}` });
        } catch (e) {
            res.json({ success: false, message: e.message });
        }
    });

    // ========== LOAD DATA ==========
    app.post('/web/loaddata', async (req, res) => {
        const { code, groupId } = req.body;
        const config = getConfig();

        if (config?.code !== code) {
            return res.json({ success: false });
        }

        try {
            const dbPath = path.join(tuongtacDataPath, `${groupId}.json`);
            if (!fs.existsSync(dbPath)) {
                return res.json({ success: false, message: 'No database' });
            }

            let groupData = JSON.parse(fs.readFileSync(dbPath, "utf8"));

            const threadInfo = await api.getThreadInfo(groupId);
            const currentMemberIDs = threadInfo.participantIDs || [];

            // Remove left members
            groupData.members = groupData.members.filter(m => currentMemberIDs.includes(m.id));

            // Add new members
            const afterIDs = groupData.members.map(m => m.id);
            for (const id of currentMemberIDs) {
                if (!afterIDs.includes(id)) {
                    groupData.members.push({ id, day: 0, week: 0, total: 0, lastInteract: null });
                }
            }

            groupData.lastSync = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");
            saveGroupData(groupId, groupData);

            const members = groupData.members.map(m => ({
                id: m.id,
                name: global.data.userName.get(m.id) || "User",
                day: m.day || 0,
                week: m.week || 0,
                total: m.total || 0,
                lastInteract: m.lastInteract || "-"
            }));

            res.json({ success: true, members });
        } catch (e) {
            res.json({ success: false, message: e.message });
        }
    });

    return app;
}

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");
    const port = parseInt(args[0]) || 3002;

    if (serverInstance) {
        serverInstance.close();
        serverInstance = null;
    }

    try {
        const app = createServer(api, port);

        serverInstance = app.listen(port, () => {
            console.log(`[WEBSERVER] Started on port ${port}`);
        });

        botApi = api;

        return api.sendMessage(
            `[ WEB SERVER ]\n` +
            `────────────────────\n` +
            `✅ Server started!\n` +
            `🌐 Port: ${port}\n` +
            `────────────────────\n` +
            `📡 Endpoints:\n` +
            `• GET /ping - Uptime Robot\n` +
            `• GET /health - Health check\n` +
            `• POST /web/sync - Get data\n` +
            `• POST /web/kick - Kick member\n` +
            `────────────────────\n` +
            `⏰ ${time}`,
            threadID, messageID
        );
    } catch (e) {
        return api.sendMessage(`❌ Error: ${e.message}`, threadID, messageID);
    }
};

// Auto start
module.exports.onLoad = function ({ api }) {
    const port = 3002;

    try {
        const app = createServer(api, port);
        serverInstance = app.listen(port, () => {
            console.log(`[WEBSERVER] Auto-started on port ${port}`);
        });
        botApi = api;
    } catch (e) {
        console.log(`[WEBSERVER] Failed: ${e.message}`);
    }
};
