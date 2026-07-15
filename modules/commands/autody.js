let axios = require('axios');
let fs = require('fs');
const { douyindl } = require('./../../utils/douyindl.js');

let is_url = url => /^http(s|):\/\//.test(url);

let stream_url = (url, type) => axios.get(url, {
    responseType: 'arraybuffer'
}).then(res => {
    let path = __dirname + '/cache/' + Date.now() + '.' + type;
    fs.writeFileSync(path, res.data);
    setTimeout(p => fs.unlinkSync(p), 1000 * 60, path);
    return fs.createReadStream(path);
});

exports.config = {
    name: 'auto',
    version: '0.0.1',
    hasPermssion: 0,
    credits: 'DC-Nam',
    description: 'Auto Douyin.',
    commandCategory: 'Utility',
    usages: 'autodowntiktok',
    cooldowns: 0
};

exports.run = function(o) {};

exports.handleEvent = async function(o) {
    let a = o.event.args[0];
    let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);

    if (!is_url(a)) return;
    if (/douyin\.com/.test(a)) {
        let tiktok = await douyindl(a);
        if (!tiktok || tiktok.message) {
            console.error('Data parse error:', tiktok.message);
            return;
        }

        let attachments = [];

        if (tiktok.type === 'Photo' && tiktok.url) {
            for (let url of tiktok.url) {
                attachments.push(await stream_url(url, 'webp'));
            }
        } else if (tiktok.type === 'Video' && tiktok.play) {
            attachments.push(await stream_url(tiktok.play, 'mp4'));
        }

        if (attachments.length > 0) {
            o.api.sendMessage({
                body: `🎥 [DOUYIN] Auto Download\n\n🖍️ Title: ${tiktok.title}\n🧸 Author: ${tiktok.nickname} (${tiktok.unique_id})\n📅 Posted: ${tiktok.create_at}\n👍 Likes: ${tiktok.likeCount}\n🔄 Shares: ${tiktok.shareCount}\n💬 Comments: ${tiktok.commentCount}\n🔖 Saves: ${tiktok.collectCount}\n• React '😆' to download music.`,
                attachment: attachments
            }, o.event.threadID, (error, info) => {
                if (error) {
                    console.error('Error sending message:', error);
                    return;
                }
                global.client.handleReaction.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: o.event.senderID,
                    data: tiktok
                });
            }, o.event.messageID);
        }
    }
};

exports.handleReaction = async function (o) {
    const { threadID: t, messageID: m, reaction: r } = o.event;
    if (r != "😆") return;

    let tiktokData = global.client.handleReaction.find(entry => entry.messageID === m);
    if (!tiktokData) {
        console.error('No music link found.');
        return;
    }

    if (tiktokData.data.music && tiktokData.data.music.type === 'Audio') {
        o.api.sendMessage({
            body: `🎵 ====『 MUSIC 』====\n\n💬 Title: ${tiktokData.data.music.title}`,
            attachment: await stream_url(tiktokData.data.music.url, "mp3")
        }, t, m);
    }
};