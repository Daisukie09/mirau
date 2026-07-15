module.exports.config = {
    name: "setprefix",
    version: "1.0.1",
    hasPermssion: 1,
    credits: "Mirai Team",
    description: "Reset group prefix",
    commandCategory: "User",
    usages: "[prefix/reset]",
    cooldowns: 0,
    images: [],
};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, body } = event;
    const { PREFIX } = global.config;

    // Get current time in Asia/Ho_Chi_Minh timezone
    const date = new Date();
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    const vietnamTime = new Date(utcTime + 7 * 3600000); // GMT+7
    const currentTime = vietnamTime.toLocaleTimeString('vi-VN') + " || " + vietnamTime.toLocaleDateString('vi-VN');

    let threadSetting = global.data.threadData.get(threadID) || {};
    let prefix = threadSetting.PREFIX || PREFIX;

    const triggerWords = ["prefix", "prefix bot là gì", "quên prefix r", "dùng sao"];
    if (triggerWords.includes(body.toLowerCase())) {
        const msg = `\n✏️ Group prefix: ${prefix}\n 📎 System prefix: ${global.config.PREFIX}\n` +
                    ` 📝 Total commands: ${client.commands.size}\n 👥 Bot users: ${global.data.allUserID.length}\n` +
                    `  🏘️ Total groups: ${global.data.allThreadID.length}\n` +
                    `────────────────────\n ⏰ Time: ${currentTime}`;
        api.sendMessage({ body: msg, attachment: global.khanhdayr.splice(0, 1) }, threadID, (err, info) => 
            setTimeout(() => api.unsendMessage(info.messageID), 10000));
    }
};

module.exports.handleReaction = async function ({ api, event, Threads, handleReaction }) {
    if (event.userID != handleReaction.author) return;
    
    try {
        const { threadID, messageID } = event;
        let data = (await Threads.getData(threadID)).data || {};
        data.PREFIX = handleReaction.PREFIX;
        
        await Threads.setData(threadID, { data });
        global.data.threadData.set(threadID, data);

        api.unsendMessage(handleReaction.messageID);
        api.changeNickname(` ${handleReaction.PREFIX} ┊ ${global.config.BOTNAME}`, threadID, event.senderID);
        api.sendMessage(`☑️ Group prefix has been changed to: ${handleReaction.PREFIX}`, threadID, messageID);
    } catch (e) {
        console.error(e);
    }
};

module.exports.run = async ({ api, event, args, Threads }) => {
    if (!args[0]) return api.sendMessage(`⚠️ Please enter a new prefix`, event.threadID, event.messageID);

    const prefix = args[0].trim();
    if (!prefix) return api.sendMessage(`⚠️ Please enter a valid prefix`, event.threadID, event.messageID);

    if (prefix === "reset") {
        let data = (await Threads.getData(event.threadID)).data || {};
        data.PREFIX = global.config.PREFIX;
        
        await Threads.setData(event.threadID, { data });
        global.data.threadData.set(event.threadID, data);

        const uid = api.getCurrentUserID();
        api.changeNickname(` ${global.config.PREFIX} | ${global.config.BOTNAME}`, event.threadID, uid);
        api.sendMessage(`☑️ Prefix has been reset to default: ${global.config.PREFIX}`, event.threadID, event.messageID);
    } else {
        api.sendMessage(`📝 You requested to set a new prefix: ${prefix}\n👉 React to this message to confirm`, event.threadID, (err, info) => {
            global.client.handleReaction.push({
                name: "setprefix",
                messageID: info.messageID,
                author: event.senderID,
                PREFIX: prefix
            });
            setTimeout(() => api.unsendMessage(info.messageID), 10000);
        });
    }
};