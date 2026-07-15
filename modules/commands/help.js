const { createCanvas, loadImage } = require('canvas');

this.config = {
    name: "help",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "DC-Nam mod by Niio-team",
    description: "View command list and info",
    commandCategory: "User",
    usages: "[command name/all]",
    cooldowns: 0
};

this.run = async function({ api, event, args }) {
    const { threadID: tid, messageID: mid, senderID: sid } = event;
    const cmds = global.client.commands;
    const type = args[0] ? args[0].toLowerCase() : "";
    let msg = "";

    if (type) {
        const command = Array.from(cmds.values()).find(cmd => cmd.config.name.toLowerCase() === type);
        if (!command) {
            msg = `⚠️ Command '${type}' not found in the system.`;
            return api.sendMessage(msg, tid, mid);
        }
        const cmd = command.config;

        // Create canvas to display command info
        const canvas = createCanvas(600, 400);
        const ctx = canvas.getContext('2d');

        // Set background
        ctx.fillStyle = '#ffffff';         // White background color
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw command info onto canvas
        ctx.fillStyle = '#000000';         // Black text color
        ctx.font = '20px Arial';
        ctx.fillText(`📜 Command Name: ${cmd.name}`, 20, 50);
        ctx.fillText(`🕹️ Version: ${cmd.version}`, 20, 100);
        ctx.fillText(`🔑 Permission: ${TextPr(cmd.hasPermssion)}`, 20, 150);
        ctx.fillText(`📝 Description: ${cmd.description}`, 20, 200);
        ctx.fillText(`🏘️ Category: ${cmd.commandCategory}`, 20, 250);
        ctx.fillText(`📌 Usage: ${cmd.usages}`, 20, 300);
        ctx.fillText(`⏳ Cooldown: ${cmd.cooldowns}s`, 20, 350);

        const buffer = canvas.toBuffer();
        return api.sendMessage({ body: `Command usage guide for ${cmd.name}`, attachment: buffer }, tid, mid);
    } else {
        // If no command name, display command list
        // ... (This part is unchanged)
    }
};

function TextPr(permission) {
    return permission === 0 ? "Member" : 
           permission === 1 ? "Group Admin" : 
           permission === 2 ? "Bot Admin" : 
           "Full Access";
}
