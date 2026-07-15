module.exports.config = {
    name: 'listbox',
    version: '1.0.0',
    credits: 'ManhG',
    hasPermssion: 2,
    description: '[Ban/Unban/Remove/Addme] List threads the bot has joined',
    commandCategory: 'Admin',
    usages: '[page number/all]',
    cooldowns: 5
};

module.exports.handleReply = async function({ api, event, args, Threads, handleReply }) {
    const { threadID, messageID } = event;
    if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;
    const moment = require("moment-timezone");
    const time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss L");
    var arg = event.body.split(" ");

    switch (handleReply.type) {
        case "reply":
            {
                if (arg[0] == "ban" || arg[0] == "Ban") {
                    var nums = arg.slice(1).map(n => parseInt(n)); // Get list of ordinal numbers
                    for (let num of nums) {
                        var idgr = handleReply.groupid[num - 1];
                        var groupName = handleReply.groupName[num - 1];
                        const data = (await Threads.getData(idgr)).data || {};
                        data.banned = true;
                        data.dateAdded = time;
                        await Threads.setData(idgr, { data });
                        global.data.threadBanned.set(idgr, { dateAdded: data.dateAdded });
                        api.sendMessage(`Group ${groupName} (TID: ${idgr}) has been banned.`, threadID);
                    }
                    api.unsendMessage(handleReply.messageID);
                }

                if (arg[0] == "unban" || arg[0] == "Unban") {
                    var nums = arg.slice(1).map(n => parseInt(n));
                    for (let num of nums) {
                        var idgr = handleReply.groupid[num - 1];
                        var groupName = handleReply.groupName[num - 1];
                        const data = (await Threads.getData(idgr)).data || {};
                        data.banned = false;
                        data.dateAdded = null;
                        await Threads.setData(idgr, { data });
                        global.data.threadBanned.delete(idgr);
                        api.sendMessage(`Group ${groupName} (TID: ${idgr}) has been unbanned.`, threadID);
                    }
                    api.unsendMessage(handleReply.messageID);
                }

                if (arg[0] == "out" || arg[0] == "Out") {
                    var nums = arg.slice(1).map(n => parseInt(n));
                    for (let num of nums) {
                        var idgr = handleReply.groupid[num - 1];
                        var groupName = handleReply.groupName[num - 1];
                        api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr);
                        api.sendMessage(`Left group ${groupName} (TID: ${idgr}).`, threadID);
                    }
                    api.unsendMessage(handleReply.messageID);
                }

                if (arg[0] == "Join" || arg[0] == "Join") {
                    var nums = arg.slice(1).map(n => parseInt(n));
                    var msg = "";
                    for (let num of nums) {
                        var idgr = handleReply.groupid[num - 1];
                        var groupName = handleReply.groupName[num - 1];
                        try {
                            api.addUserToGroup(parseInt(event.senderID), idgr);
                            msg += `Added you to group ${groupName} (TID: ${idgr})\n`;
                        } catch (error) {
                            msg += `Cannot add to group ${groupName} (TID: ${idgr}) due to error: ${error.message}\n`;
                        }
                    }
                    api.sendMessage(msg, threadID);
                    api.unsendMessage(handleReply.messageID);
                }
                break;
            }
    }
};

module.exports.run = async function({ api, event, args }) {
    const permission = ["100085073240621", "100034415418637", "100029340348630"];
    if (!permission.includes(event.senderID)) return api.sendMessage("You do not have permission to use this command.", event.threadID, event.messageID);

    try {
        var inbox = await api.getThreadList(100, null, ['INBOX']);
        let list = [...inbox].filter(group => group.isSubscribed && group.isGroup);
        var listthread = [];
        
        for (var groupInfo of list) {
            const threadInfo = await api.getThreadInfo(groupInfo.threadID);
            listthread.push({
                id: groupInfo.threadID,
                name: groupInfo.name || "Unnamed",
                participants: groupInfo.participants.length,
                inviteLinkEnabled: groupInfo.inviteLinkEnabled || false, // Check invite link status
                messageCount: threadInfo.messageCount || 0, // Get total message count
                inviteLink: threadInfo.inviteLink || (threadInfo.inviteLinkEnabled ? "Has invite link" : "No invite link"), // Get invite link
                approvalStatus: threadInfo.approvalEnabled || false // Check approval status
            });
        }

        listthread.sort((a, b) => b.participants - a.participants);
        
        var groupid = [];
        var groupName = [];
        var page = parseInt(args[0]) || 1;
        var limit = 10; // Limit number of groups displayed per page
        var msg = `====『 GROUP LIST 』====\n\n`;
        var numPage = Math.ceil(listthread.length / limit);

        for (var i = limit * (page - 1); i < limit * page; i++) {
            if (i >= listthread.length) break;
            let group = listthread[i];
            msg += `${i + 1}. ${group.name}\n💌 TID: ${group.id}\n👤 Member count: ${group.participants}\n🔗 Invite link: ${group.inviteLinkEnabled ? "On" : "Off"}\n📩 Total messages: ${group.messageCount}\n🔗 Link: ${group.inviteLink}\n📝 Approval status: ${group.approvalStatus ? "On" : "Off"}\n\n`;
            groupid.push(group.id);
            groupName.push(group.name);
        }

        msg += `Page ${page}/${numPage}\nUse command ${global.config.PREFIX}listbox + page number/all\n`;

        api.sendMessage(msg + "Reply with commands: Out, Ban, Unban, Join + sequence number to perform action.", event.threadID, (e, data) =>
            global.client.handleReply.push({
                name: this.config.name,
                author: event.senderID,
                messageID: data.messageID,
                groupid,
                groupName,
                type: 'reply'
            })
        );
    } catch (e) {
        console.log(e);
        api.sendMessage("An error occurred, please try again later.", event.threadID);
    }
};