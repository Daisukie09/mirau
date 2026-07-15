const moment = require('moment-timezone');
const fs = require('fs').promises;

module.exports = {
  config: {
    name: "upt",
    version: "2.1.4",
    hasPermission: 2,
    credits: "Vtuan rmk Niio-team",
    description: "Display ping, uptime and package count info!",
    commandCategory: "System",
    usePrefix: false,
    usages: "",
    cooldowns: 5
  },
  run: async ({ api, event, Users }) => {
    const pingStart = Date.now();

    // Calculate uptime using process uptime only
    const uptime = process.uptime(); 
    const uptimeDays = Math.floor(uptime / (60 * 60 * 24));
    const uptimeHours = Math.floor((uptime % (60 * 60 * 24)) / (60 * 60));
    const uptimeMinutes = Math.floor((uptime % (60 * 60)) / 60);
    const uptimeSeconds = Math.floor(uptime % 60);
    
    // Get user name
    let userName = await Users.getNameUser(event.senderID);
let threadInfo = await api.getThreadInfo(event.threadID);
  let threadName = threadInfo.threadName ;

    // Calculate real ping time
    const pingReal = Date.now() - pingStart;

    // Get the number of packages in package.json
    async function getDependencyCount() {
      try {
        const packageJsonString = await fs.readFile('package.json', 'utf8');
        const packageJson = JSON.parse(packageJsonString);
        const depCount = Object.keys(packageJson.dependencies).length;
        return depCount;
      } catch (error) {
        console.error('❎ Cannot read package.json file:', error);
        return -1;
      }
    }

    const dependencyCount = await getDependencyCount();

    // Prepare reply message
    const replyMsg = `
⏳ Uptime: ${uptimeDays} days ${uptimeHours.toString().padStart(2, '0')} hours ${uptimeMinutes.toString().padStart(2, '0')} minutes ${uptimeSeconds.toString().padStart(2, '0')} seconds
🛜 Ping: ${pingReal}ms
📦 Packages alive: ${dependencyCount >= 0 ? dependencyCount : "Unknown"}
👤 Requested by: ${userName} - ${threadName}
    `.trim();

    // Send the message with attachment
    api.sendMessage({ 
      body: replyMsg, 
      attachment: global.khanhdayr.splice(0, 1) 
    }, event.threadID, (err, info) => {
      if (!err) {
        // Set a timeout to recall the message after 10 seconds
        setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, 1000000); // 10 seconds = 10000 ms
      }
    });
  }
}; 