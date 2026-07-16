module.exports.config = {
  name: "out",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "DũngUwU",
  description: "out box",
  commandCategory: "System",
  usePrefix:true,
  usages: "[tid]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  const permission = ["61559079650241 ","100085073240621"];
  if (!permission.includes(event.senderID))
  return api.sendMessage("⚠️Sorry! This command is for admins only", event.threadID, event.messageID);
  var id;
  if (!args.join("")) {
    id = event.threadID;
  } else {
    id = parseInt(args.join(" "));
  }
  return api.sendMessage("𝐅𝐨𝐥𝐥𝐨𝐰𝐢𝐧𝐠 𝐦𝐚𝐬𝐭𝐞𝐫'𝐬 𝐨𝐫𝐝𝐞𝐫𝐬 💌", id, () => api.removeUserFromGroup(api.getCurrentUserID(), id))
}