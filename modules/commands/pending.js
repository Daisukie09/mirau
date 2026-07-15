module.exports.config = {
    name: "pending",
    version: "1.0.6",
    credits: "CatalizCS mod by Kadeer",
    hasPermssion: 2,
    description: "Manage pending messages of the bot",
    commandCategory: "Admin",
    usages: "[u] [t] [a]",
    cooldowns: 0
};

module.exports.onLoad = () => {
    const fs = require("fs-extra");
    const request = require("request");
    const dirMaterial = `${__dirname}/data/`;
    if (!fs.existsSync(dirMaterial + "menu")) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(dirMaterial + "trogiup.jpg")) request("https://i.imgur.com/rtb6OgR.png").pipe(fs.createWriteStream(dirMaterial + "trogiup.png"));
}

module.exports.handleReply = async function({ api, event, handleReply }) {
    if (String(event.senderID) !== String(handleReply.author)) return;
    const { body, threadID, messageID } = event;

    if (isNaN(body) && body.indexOf("c") === 0 || body.indexOf("cancel") === 0) {
        const index = (body.slice(1)).split(/\s+/);
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
                return api.sendMessage(`${singleIndex} is not a valid number`, threadID, messageID);
        }
        return api.sendMessage(`𝙍𝙚𝙟𝙚𝙘𝙩𝙚𝙙 ✅`, threadID, messageID);
    } else {
        const index = body.split(/\s+/);
        const fs = require("fs");
        let count = 0;

        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
                return api.sendMessage(`${singleIndex} is not a valid number`, threadID, messageID);

            // Change group nickname
            api.changeNickname(`〖 ${global.config.PREFIX} 〗• ${(!global.config.BOTNAME) ? "Bot" : global.config.BOTNAME}`, handleReply.pending[singleIndex - 1].threadID, api.getCurrentUserID());
            
            // Send notification message
            api.sendMessage({
                body: `➢ 𝙍𝙚𝙘𝙚𝙞𝙫𝙚𝙙 𝘼𝙘𝙩𝙞𝙫𝙖𝙩𝙞𝙤𝙣 𝙊𝙧𝙙𝙚𝙧 𝙁𝙧𝙤𝙢 𝘼𝙙𝙢𝙞𝙣\n➢ 𝙒𝙞𝙨𝙝 𝙔𝙤𝙪 𝙖 𝙂𝙧𝙚𝙖𝙩 𝙏𝙞𝙢𝙚 𝙐𝙨𝙞𝙣𝙜 𝙩𝙝𝙚 𝘽𝙤𝙩`,
                attachment: fs.createReadStream(__dirname + "/data/trogiup.png")
            }, handleReply.pending[singleIndex - 1].threadID, (error, info) => {
                // Recall the image message after 3 seconds
                if (!error) {
                    setTimeout(() => {
                        api.unsendMessage(info.messageID);
                    }, 3000);
                }
            });

            count += 1;
        }

        return api.sendMessage(`𝘼𝙥𝙥𝙧𝙤𝙫𝙚𝙙 ✅`, threadID, messageID);
    }
}

module.exports.run = async function({ api, event, args }) {
    if (args.join() === "") {
        api.sendMessage("You can use pending:\nPending user: Pending users\nPending thread: Pending threads\nPending all: All pending ", event.threadID, event.messageID);
        return;
    }
    
    const content = args.slice(1, args.length);   
    switch (args[0]) {
        case "user":
        case "u":
        case "-u":
        case "User": {
            const { threadID, messageID } = event;
            const commandName = this.config.name;
            var msg = "", index = 1;

            try {
                var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
                var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
            } catch (e) { return api.sendMessage("𝙀𝙧𝙧𝙤𝙧 🚫", threadID, messageID) }

            const list = [...spam, ...pending].filter(group => group.isGroup == false);

            for (const single of list) msg += `${index++}/ ${single.name}(${single.threadID})\n`;

            if (list.length !== 0) return api.sendMessage(`𝙋𝙚𝙣𝙙𝙞𝙣𝙜 𝙇𝙞𝙨𝙩 : ${list.length} 𝙐𝙨𝙚𝙧𝙨\n\n${msg}`, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: commandName,
                    messageID: info.messageID,
                    author: event.senderID,
                    pending: list
                });
            }, messageID);
            else return api.sendMessage("𝙀𝙢𝙥𝙩𝙮 🛡️", threadID, messageID);
        }
        case "thread":
        case "-t":
        case "t":
        case "Thread": {
            const { threadID, messageID } = event;
            const commandName = this.config.name;
            var msg = "", index = 1;

            try {
                var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
                var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
            } catch (e) { return api.sendMessage("𝙀𝙧𝙧𝙤𝙧 🚫", threadID, messageID) }

            const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

            for (const single of list) msg += `${index++}/ ${single.name}(${single.threadID})\n`;

            if (list.length !== 0) return api.sendMessage(`𝙋𝙚𝙣𝙙𝙞𝙣𝙜 𝙇𝙞𝙨𝙩 : ${list.length} 𝙂𝙧𝙤𝙪𝙥𝙨\n\n${msg}`, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: commandName,
                    messageID: info.messageID,
                    author: event.senderID,
                    pending: list
                });
            }, messageID);
            else return api.sendMessage("𝙀𝙢𝙥𝙩𝙮 🛡️", threadID, messageID);
        }
        case "all":
        case "a":
        case "-a":
        case "al": {
            const { threadID, messageID } = event;
            const commandName = this.config.name;
            var msg = "", index = 1;

            try {
                var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
                var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
            } catch (e) { return api.sendMessage("𝙀𝙧𝙧𝙤𝙧 🚫", threadID, messageID) }

            const listThread = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);
            const listUser = [...spam, ...pending].filter(group => group.isGroup == false);
            const list = [...spam, ...pending].filter(group => group.isSubscribed);

            for (const single of list) msg += `${index++}/ ${single.name}(${single.threadID})\n`;

            if (list.length !== 0) return api.sendMessage(`𝙋𝙚𝙣𝙙𝙞𝙣𝙜 𝙇𝙞𝙨𝙩 : ${list.length} 𝙐𝙨𝙚𝙧 & 𝙏𝙝𝙧𝙚𝙖𝙙\n\n${msg}`, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: commandName,
                    messageID: info.messageID,
                    author: event.senderID,
                    pending: list
                });
            }, messageID);
            else return api.sendMessage("𝙀𝙢𝙥𝙩𝙮 🛡️", threadID, messageID);
        }
    }
}
