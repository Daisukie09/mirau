module.exports.config = {
    name: "adduser",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "D-Jukie",
  usePrefix: false,
    description: "Add user to group by link or uid",
    commandCategory: "Users",
    usages: "[args]",
    cooldowns: 5
};
module.exports.run = async function ({ api, event, args, Threads, Users }) {
const { threadID, messageID } = event;
const axios = require('axios')
const link = args.join(" ")
if(!args[0]) return api.sendMessage('Please enter the link or id of the user to add to the group!', threadID, messageID);
var { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
if(link.indexOf(".com/")!==-1) {
    const res = await axios.get(`https://ffb.vn/api/tool/get-id-fb?idfb=${link}`);
    var uidUser = res.data.id
    api.addUserToGroup(uidUser, threadID, (err) => {
    if (participantIDs.includes(uidUser)) return api.sendMessage(`User is already in the group`, threadID, messageID);
    if (err) return api.sendMessage(`Cannot add user to the group`, threadID, messageID);
    else if (approvalMode && !adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage(`Added user to approval list`, threadID, messageID);
    else return api.sendMessage(`Successfully added user to the group`, threadID, messageID);
    });
    }
  else { 
    var uidUser = args[0] 
    api.addUserToGroup(uidUser, threadID, (err) => {
    if (participantIDs.includes(uidUser)) return api.sendMessage(`User is already in the group`, threadID, messageID);
    if (err) return api.sendMessage(`Cannot add user to the group`, threadID, messageID);
    else if (approvalMode && !adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage(`Added user to approval list`, threadID, messageID);
    else return api.sendMessage(`Successfully added user to the group`, threadID, messageID);
    });
  }
}