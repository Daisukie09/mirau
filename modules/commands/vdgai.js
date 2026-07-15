module.exports.config = {
    name: "vdgai",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "cos cais loon",
    description: "cos",
usePrefix: false,
    commandCategory: "System",
    usages: "cos",
    cooldowns: 5
};

module.exports.run = ({ api, event, args }) => {
    const replyMsg = "🐲 you can't even get it";
    return api.sendMessage({
        body: replyMsg,
        attachment: global.khanhdayr.splice(0, 1),
    }, event.threadID, event.messageID);
};