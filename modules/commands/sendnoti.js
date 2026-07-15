const fs = require('fs');
const request = require('request');

module.exports.config = {
    name: "send",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "TruongMini, mod by Lê Chí (lechii)",
    description: "Send message to all boxes",
    commandCategory: "Admin",
    usages: "[prefix]send [message]",
    cooldowns: 5,
}

let atmDir = [];

const getAtm = (atm, body) => new Promise(async (resolve) => {
    let msg = {}, attachment = [];
    msg.body = body;
    for(let eachAtm of atm) {
        await new Promise(async (resolve) => {
            try {
                let response =  await request.get(eachAtm.url),
                    pathName = response.uri.pathname,
                    ext = pathName.substring(pathName.lastIndexOf(".") + 1),
                    path = __dirname + `/cache/${eachAtm.filename}.${ext}`
                response
                    .pipe(fs.createWriteStream(path))
                    .on("close", () => {
                        attachment.push(fs.createReadStream(path));
                        atmDir.push(path);
                        resolve();
                    })
            } catch(e) { console.log(e); }
        })
    }
    msg.attachment = attachment;
    resolve(msg);
})

module.exports.handleReply = async function ({ api, event, handleReply, Users, Threads }) {
    const moment = require("moment-timezone");
      var gio = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY - HH:mm:s");
    const { threadID, messageID, senderID, body } = event;
    let name = await Users.getNameUser(senderID);
    switch (handleReply.type) {
        case "sendnoti": {
            let text = `[ Reply From User ]\n──────────────────\n👤 From User: ${name}\n🔗 Link: https://www.facebook.com/profile.php?id=${event.senderID}\n🏘️ Group: ${(await Threads.getInfo(threadID)).threadName || "Unknow"}\n⏰ Time: ${gio}\n📝 Content: ${body}\n\n📌 Reply this message to respond`;
            if(event.attachments.length > 0) text = await getAtm(event.attachments, `[ Reply From User ]\n──────────────────\n👤 From User: ${name}\n🔗 Link: https://www.facebook.com/profile.php?id=${event.senderID}\n🏘️ Group: ${(await Threads.getInfo(threadID)).threadName || "Unknow"}\n⏰ Time: ${gio}\n📝 Content: ${body}\n\n📌 Reply this message to respond` );
            api.sendMessage(text, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.unlinkSync(each))
                atmDir = [];
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    messID: messageID,
                    threadID
                })
            });
            break;
        }
        case "reply": {
            let text = `[ Reply From Admin ]\n──────────────────\n👤 From Admin: ${name}\n🔗 Link: https://www.facebook.com/profile.php?id=${event.senderID}\n🏘️ Sent from: ${(await Threads.getInfo(threadID)).threadName || "Unknow"}\n⏰ Time: ${gio}\n📝 Content: ${body}\n\n📌 Reply this message to respond`;
            if(event.attachments.length > 0) text = await getAtm(event.attachments, `[ Reply From Admin ]\n──────────────────\n👤 From Admin: ${name}\n🔗 Link: https://www.facebook.com/profile.php?id=${event.senderID}\n🏘️ Sent from: ${(await Threads.getInfo(threadID)).threadName || "Unknow"}\n⏰ Time: ${gio}\n📝 Content: ${body}\n\n📌 Reply this message to respond`);
            api.sendMessage(text, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.unlinkSync(each))
                atmDir = [];
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "sendnoti",
                    messageID: info.messageID,
                    threadID
                })
            }, handleReply.messID);
            break;
        }
    }
}

module.exports.run = async function ({ api, event, args, Users }) {
    const moment = require("moment-timezone");
    var gio = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY - HH:mm:s");
    const { threadID, messageID, senderID, messageReply } = event;
    if (!args[0]) return api.sendMessage("Please input message", threadID);
    
    let allThread = global.data.allThreadID || [];
    let can = 0, canNot = 0;
    let text = `[ Admin Notification ]\n──────────────────\n👤 From Admin: ${await Users.getNameUser(senderID)}\n🔗 Link: https://www.facebook.com/profile.php?id=${event.senderID}\n🏘️ Sent from: ${event.isGroup == true ? 'Group ' + global.data.threadInfo.get(event.threadID).threadName : 'from private chat with bot '}\n⏰ Time: ${gio}\n📝 Content: ${args.join(" ")}\n\n📌 Reply this message to respond\n💧 Will be recalled after 10s`;
    
    if (event.type == "message_reply") text = await getAtm(messageReply.attachments, `[ Admin Notification ]\n──────────────────\n👤 From Admin: ${await Users.getNameUser(senderID)}\n🔗 Link: https://www.facebook.com/profile.php?id=${event.senderID}\n🏘️ Sent from: ${event.isGroup == true ? 'Group ' + global.data.threadInfo.get(event.threadID).threadName : 'from private chat with bot '}\n⏰ Time: ${gio}\n📝 Content: ${args.join(" ")}\n\n📌 Reply this message to respond`);

    await new Promise(resolve => {
        allThread.forEach((each) => {
            try {
                api.sendMessage(text, each, (err, info) => {
                    if (err) { canNot++; }
                    else {
                        can++;
                        atmDir.forEach(each => fs.unlinkSync(each))
                        atmDir = [];
                        global.client.handleReply.push({
                            name: this.config.name,
                            type: "sendnoti",
                            messageID: info.messageID,
                            messID: messageID,
                            threadID
                        })
                        resolve();
                        
                        // Set a timeout to delete the message after 10 seconds
                        setTimeout(() => {
                            api.deleteMessage(info.messageID);
                        }, 10000); // 10000 milliseconds = 10 seconds
                    }
                })
            } catch (e) { console.log(e) }
        })
    })

    // Add a 10-second delay before confirming the notification sent successfully
    setTimeout(() => {
        api.sendMessage(`✅ Successfully sent notification to ${can} groups, ⚠️ Failed to send notification to ${canNot} groups`, threadID);
    }, 10000); // 10000 milliseconds = 10 seconds
}