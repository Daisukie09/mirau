const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: 'cleardata',
    version: '1.0.0',
    hasPermssion: 2, // ADMIN BOT only
    credits: 'TDF-28 + AI',
    description: 'Delete junk data to reduce storage',
    commandCategory: 'Admin Bot',
    usages: '[cache/tt/all/status/auto on|off]',
    cooldowns: 5,
    usePrefix: true
};

// Paths to clean
const PATHS = {
    cache: path.join(__dirname, 'cache'),
    tt: path.join(__dirname, 'tt'),
    timeJoin: path.join(__dirname, 'data', 'timeJoin.json'),
    dataCache: path.join(__dirname, 'cache', 'data'),
    lolx: path.join(__dirname, 'cache', 'lolx')
};

// Extensions to delete in cache
const CACHE_EXTENSIONS = ['.mp4', '.mp3', '.png', '.jpg', '.jpeg', '.gif', '.m4a', '.webp'];

// Calculate folder size
function getFolderSize(folderPath) {
    let totalSize = 0;
    try {
        if (!fs.existsSync(folderPath)) return 0;
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                totalSize += getFolderSize(filePath);
            } else {
                totalSize += stats.size;
            }
        }
    } catch (e) {
        return 0;
    }
    return totalSize;
}

// Convert bytes to MB/GB
function formatSize(bytes) {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' Bytes';
}

// Delete cache files (mp4, mp3, png, jpg...)
function clearCache() {
    let count = 0;
    let size = 0;
    try {
        const cachePath = PATHS.cache;
        if (!fs.existsSync(cachePath)) return { count: 0, size: 0 };

        const files = fs.readdirSync(cachePath);
        for (const file of files) {
            const filePath = path.join(cachePath, file);
            const stats = fs.statSync(filePath);

            if (stats.isFile() && CACHE_EXTENSIONS.some(ext => file.toLowerCase().endsWith(ext))) {
                size += stats.size;
                fs.unlinkSync(filePath);
                count++;
            }
        }

        // Delete lolx subdirectory
        if (fs.existsSync(PATHS.lolx)) {
            const lolxFiles = fs.readdirSync(PATHS.lolx);
            for (const file of lolxFiles) {
                const filePath = path.join(PATHS.lolx, file);
                const stats = fs.statSync(filePath);
                if (stats.isFile()) {
                    size += stats.size;
                    fs.unlinkSync(filePath);
                    count++;
                }
            }
        }
    } catch (e) {
        console.error('Error clearing cache:', e);
    }
    return { count, size };
}

// Delete interaction logs (tt folder)
function clearTT() {
    let count = 0;
    let size = 0;
    try {
        const ttPath = PATHS.tt;
        if (!fs.existsSync(ttPath)) return { count: 0, size: 0 };

        const files = fs.readdirSync(ttPath);
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(ttPath, file);
                const stats = fs.statSync(filePath);
                size += stats.size;

                // Reset file instead of deleting completely
                fs.writeFileSync(filePath, JSON.stringify({ day: [], week: [], time: 0 }, null, 4));
                count++;
            }
        }
    } catch (e) {
        console.error('Error clearing TT:', e);
    }
    return { count, size };
}

// Delete timeJoin.json
function clearTimeJoin() {
    let size = 0;
    try {
        if (fs.existsSync(PATHS.timeJoin)) {
            const stats = fs.statSync(PATHS.timeJoin);
            size = stats.size;
            fs.writeFileSync(PATHS.timeJoin, JSON.stringify({}, null, 4));
        }
    } catch (e) {
        console.error('Error clearing timeJoin:', e);
    }
    return { size };
}

// Get storage status
function getStatus() {
    const cacheSize = getFolderSize(PATHS.cache);
    const ttSize = getFolderSize(PATHS.tt);
    let timeJoinSize = 0;
    try {
        if (fs.existsSync(PATHS.timeJoin)) {
            timeJoinSize = fs.statSync(PATHS.timeJoin).size;
        }
    } catch (e) { }

    return {
        cache: cacheSize,
        tt: ttSize,
        timeJoin: timeJoinSize,
        total: cacheSize + ttSize + timeJoinSize
    };
}

// Auto-clear config
const autoConfigPath = path.join(__dirname, 'data', 'autoClearConfig.json');

function getAutoConfig() {
    try {
        if (fs.existsSync(autoConfigPath)) {
            return JSON.parse(fs.readFileSync(autoConfigPath, 'utf-8'));
        }
    } catch (e) { }
    return { enabled: false, lastClear: 0 };
}

function setAutoConfig(config) {
    fs.writeFileSync(autoConfigPath, JSON.stringify(config, null, 4));
}

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const moment = require('moment-timezone');
    const time = moment.tz('Asia/Ho_Chi_Minh').format('HH:mm:ss | DD/MM/YYYY');

    const option = (args[0] || 'status').toLowerCase();

    switch (option) {
        case 'status': {
            const status = getStatus();
            const autoConfig = getAutoConfig();
            const msg = `╔══════════════════╗
   📊 DATA STORAGE
╚══════════════════╝

📁 Cache (video/images): ${formatSize(status.cache)}
📝 TT Logs (interaction): ${formatSize(status.tt)}
⏰ TimeJoin: ${formatSize(status.timeJoin)}
────────────────────
📦 TOTAL: ${formatSize(status.total)}

🔄 Auto-Clear: ${autoConfig.enabled ? '✅ ON' : '❌ OFF'}
⏰ Time: ${time}

💡 Usage:
• /cleardata cache - Delete cache files
• /cleardata tt - Reset interaction logs
• /cleardata all - Delete all
• /cleardata auto on/off - Toggle auto-clear`;
            return api.sendMessage(msg, threadID, messageID);
        }

        case 'cache': {
            const result = clearCache();
            return api.sendMessage(`✅ Deleted ${result.count} cache files
📦 Freed: ${formatSize(result.size)}
⏰ Time: ${time}`, threadID, messageID);
        }

        case 'tt': {
            const result = clearTT();
            return api.sendMessage(`✅ Reset ${result.count} interaction log files
📦 Freed: ${formatSize(result.size)}
⏰ Time: ${time}`, threadID, messageID);
        }

        case 'all': {
            const cacheResult = clearCache();
            const ttResult = clearTT();
            const timeJoinResult = clearTimeJoin();
            const totalSize = cacheResult.size + ttResult.size + timeJoinResult.size;

            return api.sendMessage(`✅ DATA CLEARED SUCCESSFULLY
────────────────────
📁 Cache: ${cacheResult.count} files (${formatSize(cacheResult.size)})
📝 TT Logs: ${ttResult.count} files (${formatSize(ttResult.size)})
⏰ TimeJoin: ${formatSize(timeJoinResult.size)}
────────────────────
📦 TOTAL FREED: ${formatSize(totalSize)}
⏰ Time: ${time}`, threadID, messageID);
        }

        case 'auto': {
            const subOption = (args[1] || '').toLowerCase();
            const config = getAutoConfig();

            if (subOption === 'on') {
                config.enabled = true;
                config.lastClear = Date.now();
                setAutoConfig(config);
                return api.sendMessage(`✅ Auto-Clear mode ENABLED
🔄 Auto delete cache every 6 hours
📦 Auto delete when storage > 1GB
⏰ Time: ${time}`, threadID, messageID);
            } else if (subOption === 'off') {
                config.enabled = false;
                setAutoConfig(config);
                return api.sendMessage(`❌ Auto-Clear mode DISABLED
⏰ Time: ${time}`, threadID, messageID);
            } else {
                return api.sendMessage(`📋 Auto-Clear status: ${config.enabled ? '✅ ON' : '❌ OFF'}

💡 Usage:
• /cleardata auto on - Enable
• /cleardata auto off - Disable`, threadID, messageID);
            }
        }

        default:
            return api.sendMessage(`❌ Invalid command!

💡 Usage:
• /cleardata status - View storage
• /cleardata cache - Delete cache
• /cleardata tt - Reset interaction logs
• /cleardata all - Delete all
• /cleardata auto on/off - Toggle auto-clear`, threadID, messageID);
    }
};

// Export function for auto-clear
module.exports.clearCache = clearCache;
module.exports.clearTT = clearTT;
module.exports.getStatus = getStatus;
module.exports.getAutoConfig = getAutoConfig;
module.exports.formatSize = formatSize;
