const moment = require('moment-timezone');
exports.config = {
    name: 'rt',
    version: '2.0.0',
    hasPermssion: 2,
    credits: 'DC-Nam mod by Niiozic',
    description: 'Rent bot.',
    commandCategory: 'Admin',
    usages: '[]',
    cooldowns: 3
};

let fs = require('fs');
if (!fs.existsSync(__dirname + '/data')) fs.mkdirSync(__dirname + '/data');
let path = __dirname + '/data/thuebot.json';
let data = [];
let save = () => fs.writeFileSync(path, JSON.stringify(data));
if (!fs.existsSync(path)) save(); else data = require(path);
let form_mm_dd_yyyy = (input = '', split = input.split('/')) => `${split[1]}/${split[0]}/${split[2]}`;
let invalid_date = date => /^Invalid Date$/.test(new Date(date));

async function updateNickname(api, threadID, prefix, botName, timeEnd) {
    const now = new Date();
    const endTime = new Date(form_mm_dd_yyyy(timeEnd));
    const timeLeft = endTime.getTime() - now.getTime() + 25200000; // Add 7 hours

    let nickname = `『 ${prefix} 』 ⪼ ${botName}`;
    if (timeLeft >= 0) {
        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const endDateFormatted = moment(endTime).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
        nickname += ` | Expiry: ${daysLeft} days remaining (${endDateFormatted})`;
    } else {
        nickname += ` | Expiry: expired`;
    }
    try {
        await api.changeNickname(nickname, threadID, api.getCurrentUserID());
    } catch (error) {
        console.error("Error changing nickname:", error);
    }
}

exports.run = async function (o) {
    let send = (msg, callback) => {
        console.log(msg)
        o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
    }
    let prefix = (global.data.threadData.get(o.event.threadID) || {}).PREFIX || global.config.PREFIX;
    let botName = global.config.BOTNAME || "TDF-2803👾";
    let info = data.find($ => $.t_id == o.event.threadID);
    try {
        switch (o.args[0]) {
            case 'add': {
                if (!o.args[1]) return send(`❎ Usage: ${prefix}${this.config.name} add + reply to the person's message + expiry date (dd/mm/yyyy)`);
                var uid = o.event.senderID;
                if (o.event.type == "message_reply") {
                    uid = o.event.messageReply.senderID
                } else if (Object.keys(o.event.mentions).length > 0) {
                    uid = Object.keys(o.event.mentions)[0];
                }
                let t_id = o.event.threadID;
                let id = uid;
                let time_start = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
                let time_end = o.args[1];
                if (isNaN(id) || isNaN(t_id)) return send(`❎ Invalid ID!`);
                if (invalid_date(form_mm_dd_yyyy(time_end))) return send(`❎ Invalid Time!`);
                data.push({
                    t_id, id, time_start, time_end,
                });
                send(`✅ Successfully added box data to database`);
                await updateNickname(o.api, t_id, prefix, botName, time_end);
            };
                break;
            case 'info': {
                if (!info) return send("This box has not rented the bot yet.");
                let threadInfo = await o.api.getThreadInfo(info.t_id);
                send({
                    body: `[ Bot Rental Info ]\n\n👤 Renter: ${global.data.userName.get(info.id)}\n🌐 Facebook link: https://www.facebook.com/profile.php?id=${info.id}\n🏘️ Group: ${(global.data.threadInfo.get(info.t_id) || {}).threadName}\n⚡ Group ID: ${info.t_id}\n📆 Rent Date: ${info.time_start}\n⏳ Expiry: ${info.time_end}\n📌 ${(() => {
                        let time_diff = new Date(form_mm_dd_yyyy(info.time_end)).getTime() - (Date.now() + 25200000);
                        let days = Math.floor(time_diff / (1000 * 60 * 60 * 24));
                        let hour = Math.floor((time_diff / (1000 * 60 * 60)) % 24);
                        return `${days} days ${hour} hours remaining.`;
                    })()}`,
                    attachment: [await streamURL(`https://graph.facebook.com/${info.id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`), await streamURL(threadInfo.imageSrc)]
                });
            };
                break;
            case 'del': {
                let t_id = o.event.threadID
                let id = o.event.senderID
                var findData = data.find(item => item.t_id == t_id)
                if (!findData) return o.api.sendMessage("This box has not rented the bot yet", t_id)
                data = data.filter(item => item.t_id !== t_id)
                send(`✅ Successfully deleted box data`)
                await save()
                await updateNickname(o.api, t_id, prefix, botName, moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY")); // Set nickname to unrented
            };
                break;
            case 'list': {
                try {
                    const itemsPerPage = 10;
                    const totalPages = Math.ceil(data.length / itemsPerPage);
                    const startIndex = (1 - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const pageData = data.slice(startIndex, endIndex);
                    o.api.sendMessage(`[ Bot Rental List ${1}/${totalPages}]\n\n${pageData.map(($, i) => `${i + 1}. ${global.data.userName.get($.id) || "Not found"}\n📝 Status: ${new Date(form_mm_dd_yyyy($.time_end)).getTime() >= Date.now() + 25200000 ? 'Not Expired ✅' : 'Expired ❎'}\n🌾 Group: ${(global.data.threadInfo.get($.t_id) || {}).threadName || "Not found"}\nFrom: ${$.time_start}\nTo: ${$.time_end}`).join('\n\n')}\n\n→ Reply with number to view details\n→ Reply del + number to remove from list\n→ Reply out + number to leave group (separate multiple numbers by space)\n→ Reply giahan + number + dd/mm/yyyy to extend\nExample: giahan 1 01/01/2024\n→ Reply page + number to view other groups\nExample: page 2`, o.event.threadID, (err, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            event: o.event,
                            data,
                            num: endIndex,
                            messageID: info.messageID,
                            author: o.event.senderID
                        })
                    });
                } catch (e) {
                    console.log(e)
                }
            };
                break;
            default: send(`Usage: ${prefix}${this.config.name} list -> View bot rental list\nUsage: ${prefix}${this.config.name} add + reply to the person's message + expiry date (dd/mm/yyyy) -> Add group to bot rental list\nExample: ${prefix}${this.config.name} add 12/12/2023\n${prefix}${this.config.name} del -> Remove box from bot rental list\n${prefix}${this.config.name} info -> View bot rental info for this box`)
                break;
        }
    } catch (e) {
        console.log(e)
    }
    save();
};
exports.handleReply = async function (o) {
    try {
        let _ = o.handleReply;
        let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
        let prefix = (global.data.threadData.get(o.event.threadID) || {}).PREFIX || global.config.PREFIX;
        let botName = global.config.BOTNAME || "TDF-2803👾";
        if (o.event.senderID != _.event.senderID) return;
        if (isFinite(o.event.args[0])) {
            let info = data[o.event.args[0] - 1];
            let threadInfo = await o.api.getThreadInfo(info.t_id);
            if (!info) return send(`Number does not exist!`);
            return send({
                body: `[ Bot Rental Info ]\n\n👤 Renter: ${global.data.userName.get(info.id) || "Not found"}\n🌐 Facebook link: https://www.facebook.com/profile.php?id=${info.id}\n🏘️ Group: ${(global.data.threadInfo.get(info.t_id) || {}).threadName || "Not found"}\n⚡ Group ID: ${info.t_id}\n📆 Rent Date: ${info.time_start}\n⏳ Expiry: ${info.time_end}\n📌 ${(() => {
                    let time_diff = new Date(form_mm_dd_yyyy(info.time_end)).getTime() - (Date.now() + 25200000);
                    let days = Math.floor(time_diff / (1000 * 60 * 60 * 24));
                    let hour = Math.floor((time_diff / (1000 * 60 * 60)) % 24);
                    return `${days} days ${hour} hours remaining.`;
                })()}`,
                attachment: [await streamURL(`https://graph.facebook.com/${info.id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`), await streamURL(threadInfo.imageSrc)]
            });
        } else if (o.event.args[0].toLowerCase() == 'del') {
            o.event.args.shift();
            for (const i of o.event.args) {
                if (isNaN(i)) return send(`Number ${i} is invalid!`);
                if (i > data.length) return send(`Number ${i} does not exist!`);
                let tidToDelete = data[i - 1].t_id;
                data.splice(i - 1, 1);
                await updateNickname(o.api, tidToDelete, prefix, botName, moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY")); // Set nickname to unrented
            }
            send(`✅ Successfully deleted!`);
        } else if (o.event.args[0].toLowerCase() == 'giahan') {
            let STT = o.event.args[1];
            let time_end = o.event.args[2];
            if (invalid_date(form_mm_dd_yyyy(time_end))) return send(`❎ Invalid Time!`);
            if (!data[STT - 1]) return send(`Number does not exist`);
            let $ = data[STT - 1];
            $.time_end = time_end;
            send(`✅ Successfully extended the group!`);
            await updateNickname(o.api, $.t_id, prefix, botName, time_end);
        } else if (o.event.args[0].toLowerCase() == 'out') {
            for (let i of o.event.args.slice(1)) {
                const index = parseInt(i) - 1;
                if (data[index]) {
                    await o.api.removeUserFromGroup(o.api.getCurrentUserID(), data[index].t_id);
                } else {
                    send(`Number ${i} does not exist in the list.`);
                }
            }
            send(`Left the group as requested`);
        } else if (o.event.args[0].toLowerCase() == 'page') {
            try {
                const itemsPerPage = _.num;
                const totalPages = Math.ceil(data.length / itemsPerPage);
                const pageNumber = parseInt(o.event.args[1]);
                if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
                    return send(`Invalid page. Please enter a page number from 1 to ${totalPages}`);
                }
                const startIndex = (pageNumber - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const pageData = data.slice(startIndex, endIndex);
                o.api.sendMessage(`[ Bot Rental List ${pageNumber}/${totalPages}]\n\n${pageData.map(($, i) => {
                    const listItemNumber = startIndex + i + 1;
                    return `${listItemNumber}. ${global.data.userName.get($.id) || "Not found"}\n📝 Status: ${new Date(form_mm_dd_yyyy($.time_end)).getTime() >= Date.now() + 25200000 ? 'Not Expired ✅' : 'Expired ❎'}\n🌾 Group: ${(global.data.threadInfo.get($.t_id) || {}).threadName || "Not found"}\nFrom: ${$.time_start}\nTo: ${$.time_end}`
                }).join('\n\n')}\n\n→ Reply with number to view details\n→ Reply del + number to remove from list\n→ Reply out + number to leave group (separate multiple numbers by space)\n→ Reply giahan + number + dd/mm/yyyy to extend\nExample: giahan 1 01/01/2024\n→ Reply page + number to view other groups\nExample: page 2`, o.event.threadID, (err, info) => {
                    if (err) return console.log(err)
                    global.client.handleReply.push({
                        name: this.config.name,
                        event: o.event,
                        data,
                        num: endIndex,
                        messageID: info.messageID,
                        author: o.event.senderID
                    })
                });
            } catch (e) {
                console.log(e)
            }
        }
        save();
    } catch (e) {
        console.log(e)
    }
};
async function streamURL(url, mime = 'jpg') {
    const dest = `${__dirname}/data/${Date.now()}.${mime}`,
        downloader = require('image-downloader'),
        fse = require('fs-extra');
    await downloader.image({
        url, dest
    });
    setTimeout(j => fse.unlinkSync(j), 60 * 1000, dest);
    return fse.createReadStream(dest);
};