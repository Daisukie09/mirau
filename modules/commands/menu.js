module.exports.config = {
	name: 'menu',
	version: '2.0.0',
	hasPermssion: 0,
	credits: 'TDF-2803 | zL: 0878139888',
	description: 'View list of all bot features',
	commandCategory: 'Utilities',
	usages: '[command name | all | number]',
	cooldowns: 3,
	usePrefix: true,
	images: [],
	envConfig: {
		autoUnsend: {
			status: true,
			timeOut: 120
		}
	}
};

const { autoUnsend = this.config.envConfig.autoUnsend } = global.config == undefined ? {} : global.config.menu == undefined ? {} : global.config.menu;
const { compareTwoStrings, findBestMatch } = require('string-similarity');

// Define feature categories (only commands that actually exist)
const categories = {
	"🤖 AI & CHAT": {
		description: "Chat with smart AI",
		commands: ["ask", "ai", "sim", "autorep", "autotrans", "loppy"]
	},
	"🖼️ IMAGE": {
		description: "Create, edit images",
		commands: ["ảnh", "gái", "ghép", "vẽ", "tachnen", "cover", "taoanhbox", "4k", "imgur", "lo", "bantho"]
	},
	"🎵 ENTERTAINMENT": {
		description: "Music, video, entertainment",
		commands: ["ytb", "scl", "lyrics", "vdanime", "vdcos", "vdgai", "vdtrai", "xnxx", "tiktok"]
	},
	"⚙️ GROUP ADMIN": {
		description: "Manage group, members",
		commands: ["kick", "adduser", "admin", "anti", "antispam", "rule", "setname", "pending", "tromthanhvien", "pin"]
	},
	"🛡️ SECURITY": {
		description: "Anti-spam, protect group",
		commands: ["anti", "antispam", "batgiam"]
	},
	"💰 ECONOMY & GAME": {
		description: "Game, earn virtual money",
		commands: ["bank", "money", "setmoney", "work", "taixiu", "bauucua", "tile"]
	},
	"📋 INFO": {
		description: "View bot, group, user info",
		commands: ["info", "uid", "boxid", "uptime", "ping", "check", "listbox"]
	},
	"🔧 UTILITIES": {
		description: "Useful tools",
		commands: ["menu", "help", "getid", "dịch", "say", "note", "locdau", "getlink", "upload", "file", "contact", "shortcut", "gỡ"]
	},
	"📥 DOWNLOAD": {
		description: "Download video, music, files",
		commands: ["autodown3", "autoyt", "tiktok", "ytb", "scl"]
	},
	"⚡ ADMIN BOT": {
		description: "Commands for Bot Admin",
		commands: ["addadmin", "deleteadmin", "restart", "load", "shell", "run", "cmd", "code", "setprefix", "setting", "sendnoti", "out", "global", "rent", "doiacc", "buff", "cleardata", "spam", "spamping", "spamtag", "taglientuc"]
	},
	"🎲 OTHER": {
		description: "Other commands",
		commands: ["hi", "danhgia", "event", "api", "crawl", "cc", "stk", "fl", "spt", "autody", "chuilientuc"]
	}
};

module.exports.run = async function ({ api, event, args }) {
	const moment = require("moment-timezone");
	const { sendMessage: send, unsendMessage: un } = api;
	const { threadID: tid, messageID: mid, senderID: sid } = event;
	const cmds = global.client.commands;
	const prefix = (global.data.threadData.get(tid) || {}).PREFIX || global.config.PREFIX || "/";
	const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || DD/MM/YYYY");
	const botName = global.config.BOTNAME || "TDF-2803";

	// If there is a parameter - show specific command info
	if (args.length >= 1) {
		// Check if it's a number - select category
		if (!isNaN(args[0])) {
			const catKeys = Object.keys(categories);
			const index = parseInt(args[0]) - 1;
			if (index >= 0 && index < catKeys.length) {
				const catName = catKeys[index];
				const cat = categories[catName];
				let txt = `╔══════════════════╗\n   ${catName}\n╚══════════════════╝\n`;
				txt += `📝 ${cat.description}\n\n`;
				txt += `📋 COMMAND LIST:\n`;
				cat.commands.forEach((cmd, i) => {
					const cmdInfo = cmds.get(cmd);
					if (cmdInfo) {
						txt += `${i + 1}. ${prefix}${cmd} - ${cmdInfo.config.description || "No description"}\n`;
					}
				});
				txt += `\n⏰ Time: ${time}`;
				return send({ body: txt }, tid, (a, b) => {
					if (autoUnsend.status) setTimeout(v1 => un(v1), 1000 * autoUnsend.timeOut, b.messageID);
				}, mid);
			}
		}

		// Check if "all" - show all commands
		if (args[0].toLowerCase() === 'all') {
			const data = cmds.values();
			let txt = `╔══════════════════╗\n   📋 ALL COMMANDS\n╚══════════════════╝\n\n`;
			let count = 0;
			for (const cmd of data) {
				txt += `${++count}. ${prefix}${cmd.config.name} - ${cmd.config.description}\n`;
			}
			txt += `\n────────────────────\n`;
			txt += `📊 Total: ${count} commands\n`;
			txt += `⏰ Time: ${time}`;
			return send({ body: txt }, tid, (a, b) => {
				if (autoUnsend.status) setTimeout(v1 => un(v1), 1000 * autoUnsend.timeOut, b.messageID);
			}, mid);
		}

		// Search for specific command
		const cmdName = args.join(' ').toLowerCase();
		if (cmds.has(cmdName)) {
			const cmd = cmds.get(cmdName).config;
			const txt = `╔══════════════════╗\n   📖 COMMAND DETAILS\n╚══════════════════╝\n\n` +
				`📌 Name: ${cmd.name}\n` +
				`📝 Description: ${cmd.description}\n` +
				`📂 Category: ${cmd.commandCategory}\n` +
				`🔐 Permission: ${getPermText(cmd.hasPermssion)}\n` +
				`⏳ Cooldown: ${cmd.cooldowns}s\n` +
				`📋 Usage: ${prefix}${cmd.usages}\n` +
				`👤 Author: ${cmd.credits}\n` +
				`📀 Version: ${cmd.version}`;
			return send({ body: txt }, tid, mid);
		}

		// Suggest similar command
		const allCmds = Array.from(cmds.keys());
		const match = findBestMatch(cmdName, allCmds);
		if (match.bestMatch.rating >= 0.3) {
			return send(`❓ Command "${cmdName}" not found\n💡 Did you mean "${match.bestMatch.target}"?`, tid, mid);
		}
		return send(`❌ Command "${cmdName}" not found`, tid, mid);
	}

	// Display main menu
	let txt = `━━━ 🤖 ${botName.toUpperCase()} ━━━\n\n`;
	txt += `👋 Feature list:\n\n`;

	let count = 0;
	for (const [catName, cat] of Object.entries(categories)) {
		count++;
		txt += `${count}. ${catName} (${cat.commands.length})\n`;
	}

	txt += `\n━━━━━━━━━━━━━━━━\n`;
	txt += `📊 Total: ${cmds.size} commands | 🔹 Prefix: "${prefix}"\n`;
	txt += `⏰ ${time}\n\n`;
	txt += `💡 ${prefix}menu [1-${Object.keys(categories).length}] view category\n`;
	txt += `💡 ${prefix}menu all view all\n`;
	txt += `💡 ${prefix}menu [name] view details\n`;

	// console.log(`[DEBUG menu.js] Sending message to tid: ${tid}, mid: ${mid}`);
	return send({ body: txt }, tid, (err, info) => {
		// if (err) console.log(`[DEBUG menu.js] sendMessage error:`, err);
		// else console.log(`[DEBUG menu.js] sendMessage success, messageID: ${info?.messageID}`);
		if (autoUnsend.status && info?.messageID) setTimeout(v1 => un(v1), 1000 * autoUnsend.timeOut, info.messageID);
	}, mid);
};

function getPermText(perm) {
	switch (perm) {
		case 0: return "👤 Member";
		case 1: return "👑 Group Admin";
		case 2: return "🔰 Bot Admin";
		case 3: return "⭐ Operator";
		default: return "👤 Member";
	}
}