module.exports.config = {
  name: "uptime",
  version: "2.0.0",
  hasPermission: 0,
  credits: "Vtuan",
  Rent: 2,
  description: "Shows bot uptime",
  commandCategory: "Admin",
  usages: "",
  cooldowns: 5
};

module.exports.run = ({ event, api }) => {
  const uptime = process.uptime(); // Get bot uptime (in seconds)
  const uptimeHours = Math.floor(uptime / (60 * 60));
  const uptimeMinutes = Math.floor((uptime % (60 * 60)) / 60);
  const uptimeSeconds = Math.floor(uptime % 60);

  // Format uptime string as HH:MM:SS
  const uptimeString = `${uptimeHours.toString().padStart(2, '0')}:${uptimeMinutes.toString().padStart(2, '0')}:${uptimeSeconds.toString().padStart(2, '0')}`;

  const replyMsg = `Bot has been running for ${uptimeString}.`;

  // Send message with attachment from global.gaudev
  return api.sendMessage({
    body: replyMsg,
    attachment: global.gaudev.splice(0, 1)
  }, event.threadID, event.messageID);
};