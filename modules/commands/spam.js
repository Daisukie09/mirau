module.exports.config = {
  name: "spam",
  version: "1.0.0",
  hasPermssion: 3,
  Rent: 2,
  credits: "Vtuan",
  description: "spam a content to death",
  commandCategory: "War/tag",
  usages: "",
  cooldowns: 1,
  envConfig: {
    spamDelay: 2// Change spam delay to 30 seconds
  }
};

const spamThreads = new Set();
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const content = (args.length != 0) ? args.join(" ") : "🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n🔵🟣🟢🔴𝑯𝒐𝒂 𝑹𝒐̛𝒊 𝑪𝒖̛̉𝒂 𝑷𝒉𝒂̣̂𝒕 , 𝑽𝒂̣𝒏 𝑽𝒂̣̂𝒕 𝑪𝒖́𝒊 𝑫𝒂̂̀𝒖……❄️[𝑵𝑪𝑻] 𝒙 [𝑵𝑻𝒀𝑵]🏙🌃🌇🌆\n";
  if (args[0] === "stop") {
    if (spamThreads.has(threadID)) {
      spamThreads.delete(threadID);
      return api.sendMessage('Spam stopped!', threadID, messageID);
    }
    return api.sendMessage('No spam process is running!', threadID, messageID);
  }
  if (!spamThreads.has(threadID)) {
    spamThreads.add(threadID);
    api.sendMessage(`Starting spam!`, threadID, messageID);
    while (spamThreads.has(threadID)) {
      await delay(this.config.envConfig.spamDelay * 1000);
      if (spamThreads.has(threadID)) {
        api.sendMessage(content, threadID);
      }
    }
  } else {
    api.sendMessage('Already spamming!', threadID, messageID);
  }
};
