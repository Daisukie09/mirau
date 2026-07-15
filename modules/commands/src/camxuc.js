const fs = require('fs');
module.exports.config = {
    name: "camxuc",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "TruongMini fix by Niiozic",
    description: "remove message by reacting with like",
    commandCategory: "Group",
    usages: "camxuc on/off",
    usePrefix:false,
    cooldowns: 5,
};

module.exports.run = async({ api, event, args }) => {
    const { threadID, messageID } = event;
    let path = __dirname + "/data/unsendReaction.json";
    if(!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    let data = JSON.parse(fs.readFileSync(path));
    if(!data[threadID]) data[threadID] = { data: false };
   if (args.join() == "") { 
      return api.sendMessage(`Please choose on/off`, event.threadID, event.messageID)} 
    if(args[0] == "on") { 
        data[threadID].data = true; 
        api.sendMessage("✅ Enabled reaction on bot messages to remove", threadID); 
    } else if(args[0] == "off") { 
        data[threadID].data = false; 
        api.sendMessage("✅ Disabled reaction on bot messages to remove", threadID);
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
}