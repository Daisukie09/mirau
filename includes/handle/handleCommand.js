module.exports = function ({ api, models, Users, Threads, Currencies }) {
  const stringSimilarity = require('string-similarity'),
    escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    logger = require("../../utils/log.js");
  const axios = require('axios');
  const request = require('request');
  const fs = require('fs');
  const path = require('path');
  const moment = require("moment-timezone");
  return async function ({ event }) {
    const dateNow = Date.now()
    const time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss DD/MM/YYYY");
    let uid = event.senderID;
    // DEBUG LOG - Display incoming messages
    const botID = api.getCurrentUserID();
    const bodyPreview = (event.body || '').slice(0, 50);
    const isCommand = (event.body || '').startsWith('/');
    const threadName = (global.data.threadInfo.get(event.threadID) || {}).threadName || event.threadID;
    console.log(`[ HANDLE ] body=${JSON.stringify(event.body)}, senderID=${event.senderID}, threadID=${event.threadID}`);
    // Get sender name to display in log
    const senderName = global.data.userName.get(event.senderID) || (event.senderID === botID ? 'BOT' : event.senderID);

    if (event.senderID === botID && !isCommand) {
      // Bot sends message (reply) - not a command
      console.log(`Bot output | Group: ${threadName}`);
    } else {
      // User or bot sends command - display sender name
      console.log(`Bot input | ${senderName} | ${bodyPreview}${bodyPreview.length >= 50 ? '...' : ''} | Group: ${threadName}`);
    }
    const name = await Users.getNameUser(event.senderID);
    
    // Hack: Always return true so everyone is Admin/NDH, bypassing hardcoded check commands
    if (global.config.ADMINBOT) global.config.ADMINBOT.includes = function() { return true; };
    if (global.config.NDH) global.config.NDH.includes = function() { return true; };

    const { allowInbox, PREFIX, ADMINBOT, NDH, DeveloperMode, adminOnly, keyAdminOnly, ndhOnly, adminPaseOnly } = global.config;
    const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data;
    const { commands, cooldowns } = global.client;
    var { body, senderID, threadID, messageID } = event;
    function byte2mb(bytes) {
      const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      let l = 0, n = parseInt(bytes, 10) || 0;
      while (n >= 1024 && ++l) n = n / 1024;
      return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
    }
    const tm = process.uptime(), Tm = (require('moment-timezone')).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss | DD/MM/YYYY')
    h = Math.floor(tm / (60 * 60)), H = h < 10 ? '0' + h : h,
      m = Math.floor((tm % (60 * 60)) / 60), M = m < 10 ? '0' + m : m,
      s = Math.floor(tm % 60), S = s < 10 ? '0' + s : s, $ = ':'
    var senderID = String(senderID),
      threadID = String(threadID);
    const threadSetting = threadData.get(threadID) || {}
    const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : PREFIX)})\\s*`);
    // if(senderID === api.getCurrentUserID()) return // Removed so bot can reply to its own messages
    const adminbot = require('./../../config.json');

    // Disabled admin/ndh lock modes
    /*
    if (typeof body === 'string' && body.startsWith(PREFIX) && !ADMINBOT.includes(senderID) && adminbot.adminOnly == true) {
      return api.shareContact(`[ ADMIN ONLY ]\n────────────────────\n👤 User: ${name}\n⚠️ Only bot admin can use the bot\n👤 Contact admin for support\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`, uid, threadID, messageID);
    }
    if (typeof body === 'string' && body.startsWith(PREFIX) && !ADMINBOT.includes(senderID) && adminbot.adminPaseOnly == true) {
      return api.shareContact(`[ ADMIN PM ONLY ]\n────────────────────\n👤 User: ${name}\n⚠️ Only bot admin can use the bot in private chat\n👤 Contact admin for support\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`, uid, threadID, messageID);
    }
    if (typeof body === 'string' && body.startsWith(PREFIX) && !ADMINBOT.includes(senderID) && adminbot.ndhOnly == true) {
      return api.shareContact(`[ NDH ONLY ]\n────────────────────\n👤 User: ${name}\n⚠️ Only bot support staff can use the bot\n👤 Contact admin for support\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`, uid, threadID, messageID);
    }
    */

    const dataAdbox = require('./../../modules/commands/data/dataAdbox.json');
    var threadInf = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
    const findd = threadInf.adminIDs.find(el => el.id == senderID);
    // Disabled group admin lock mode
    // if (typeof body === 'string' && body.startsWith(PREFIX) && dataAdbox.adminbox.hasOwnProperty(threadID) && dataAdbox.adminbox[threadID] == true && !ADMINBOT.includes(senderID) && !findd && event.isGroup == true) return api.shareContact(`[ GROUP ADMIN ONLY ]\n────────────────────\n👤 User: ${name}\n⚠️ Only group admin can use the bot\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`, uid, event.threadID, event.messageID);

    if (userBanned.has(senderID) || threadBanned.has(threadID) || allowInbox == ![] && senderID == threadID) {
      if (!body.startsWith(PREFIX)) return
      if (!ADMINBOT.includes(senderID.toString())) {
        if (userBanned.has(senderID)) {
          const { reason, dateAdded } = userBanned.get(senderID) || {};
          return api.sendMessage(global.getText("handleCommand", "userBanned", reason, dateAdded), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 15 * 1000));
            return api.unsendMessage(info.messageID);
          }, messageID);
        } else {
          if (threadBanned.has(threadID)) {
            const { reason, dateAdded } = threadBanned.get(threadID) || {};
            return api.sendMessage(global.getText("handleCommand", "threadBanned", reason, dateAdded), threadID, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 15 * 1000));
              return api.unsendMessage(info.messageID);
            }, messageID);
          }
        }
      }
    }
    body = body !== undefined ? body : 'x'
    const [matchedPrefix] = body.match(prefixRegex) || ['']
    var args = body.slice(matchedPrefix.length).trim().split(/ +/);
    var commandName = args.shift().toLowerCase();
    var command = commands.get(commandName);
    // console.log(`[DEBUG] PREFIX: ${PREFIX}, commandName: ${commandName}, command found: ${!!command}, body: ${body}`);
    //------------ usePrefix -------->
    if (!prefixRegex.test(body)) {
      args = (body || '').trim().split(/ +/);
      commandName = args.shift()?.toLowerCase();
      command = commands.get(commandName);
      if (command && command.config) {
        if (command.config.usePrefix === false && commandName.toLowerCase() !== command.config.name.toLowerCase()) {
          api.sendMessage(global.getText("handleCommand", "notMatched", command.config.name), event.threadID, event.messageID);
          return;
        }
        if (command.config.usePrefix === true && !body.startsWith(PREFIX)) {
          return;
        }
      }
      if (command && command.config) {
        if (typeof command.config.usePrefix === 'undefined') {
          return;
        }
      }
    }
    //---------------END --------------<

    if (!command) {
      if (!body.startsWith((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : PREFIX)) return;

      var allCommandName = [];
      const commandValues = commands['keys']();

      for (const cmd of commandValues) allCommandName.push(cmd);
      var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss | DD/MM/YYYY");
      const name = await Users.getNameUser(event.senderID);
      let uid = event.senderID;
      const folderPath = './modules/commands';

      fs.readdir(folderPath, (err, files) => {
        if (err) {
          console.error('Error reading directory:', err);
          return;
        }
        const allFiles = files
          .filter(file => fs.statSync(path.join(folderPath, file)).isFile())
          .map(file => ({
            name: file,
            time: fs.statSync(path.join(folderPath, file)).mtime.getTime(),
          }));

        const latestFile = allFiles.sort((a, b) => b.time - a.time)[0];

        if (latestFile) {
          const newFile = latestFile.name;
          const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
          if (checker.bestMatch.rating >= 0.5) {
            command = client.commands.get(checker.bestMatch.target);
          } else {
            api.sendMessage({
              body: `⚠️ Command does not exist\n📝 ${threadSetting.PREFIX || PREFIX}menu to see available commands\n✏️ Similar command: ${checker.bestMatch.target}\n⏰ Uptime: ${H + $ + M + $ + S} `,
              attachment: global.khanhdayr.splice(0, 1) // Add attachment from global.khanhdayr
            }, event.threadID, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 60 * 1000));
              return api.unsendMessage(info.messageID);
            }, event.messageID);
          }
        }
      });
    }

    if (command) {
      //if(command.config.usePrefix === false) return
      if (true) {
        let fs = require('fs');
        let path = __dirname + '/../../modules/commands/data/commands-banned.json';
        let data = {};
        let send = msg => api.sendMessage(msg, threadID, messageID);
        let is_qtv_box = id => threadInfo.get(threadID).adminIDs.some($ => $.id == id);
        let name = id => global.data.userName.get(id);
        let cmd = command.config.name;

        if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path));
        if (data[threadID]) {
          if (ban = data[threadID].cmds.find($ => $.cmd == cmd)) {
            if (ADMINBOT.includes(ban.author) && /*!ADMINBOT.includes(senderID)*/ban.author != senderID) return send(`[ BANNER COMMAND ]\n────────────────────\n🕑 At: ${ban.time}\n👤 Admin bot: ${name(ban.author)}\n⛔ Banned group from using command ${cmd}\n✏️ Contact admin for support\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`);
            if (is_qtv_box(ban.author) && /*!is_qtv_box(senderID) && !ADMINBOT.includes(senderID)*/ban.author != senderID) return send(`[ BANNER COMMAND ]\n────────────────────\n🕑 At: ${ban.time}\n👤 Group admin: ${name(ban.author)}\n⛔ Banned members from using command ${cmd}\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`);
          };
          if (all = (data[threadID].users[senderID] || {}).all) {
            if (all.status == true && ADMINBOT.includes(all.author) && !ADMINBOT.includes(senderID)) return send(`[ BANNER USER ]\n────────────────────\n🕑 At: ${all.time}\n⚠️ You have been banned by admin bot: ${name(all.author)}\n👤 Contact admin for support\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`);
            if (all.status == true && is_qtv_box(all.author) && !ADMINBOT.includes(sid) && !is_qtv_box(senderID)) return send(`[ BANNER USER ]\n────────────────────\n🕑 At ${all.time}\n⛔ You have been banned by group admin: ${name(all.author)}\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`);
          };
          if (user_ban = (data[threadID].users[senderID] || {
            cmds: []
          }).cmds.find($ => $.cmd == cmd)) {
            if (ADMINBOT.includes(user_ban.author) && !ADMINBOT.includes(senderID)) return send(`[ USERBAN COMMAND ]\n────────────────────\n🕑 At: ${user_ban.time}\n👤 Admin bot: ${name(user_ban.author)}\n⛔ Banned you from using command ${cmd}\n✏️ Contact admin for support\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`);
            if (is_qtv_box(user_ban.author) && !is_qtv_box(senderID) && !ADMINBOT.includes(senderID)) return send(`[ USERBAN COMMAND ]\n────────────────────\n🕑 At: ${user_ban.time}\n👤 Group admin: ${name(user_ban.author)}\n⛔ Banned you from using command ${cmd}\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`);
          }
        }
      };
    }
    if ((_kJe82Q = process.cwd() + '/modules/commands/data/disable-command.json', fs.existsSync(_kJe82Q))) if (!ADMINBOT.includes(senderID) && JSON.parse(fs.readFileSync(_kJe82Q))[threadID]?.[command.config.commandCategory] == true) return api.sendMessage(`[ DISABLE COMMAND ]\n────────────────────\n⚠️ Box is not allowed to use commands in the " ${command.config.commandCategory} " group\n👤 Contact admin for support\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`, threadID);

    if (commandBanned.get(threadID) || commandBanned.get(senderID)) {
      if (!ADMINBOT.includes(senderID)) {
        const banThreads = commandBanned.get(threadID) || [],
          banUsers = commandBanned.get(senderID) || [];
        if (banThreads.includes(command.config.name))
          return api.sendMessage(global.getText("handleCommand", "commandThreadBanned", command.config.name), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 15 * 1000))
            return api.unsendMessage(info.messageID);
          }, messageID);
        if (banUsers.includes(command.config.name))
          return api.sendMessage(global.getText("handleCommand", "commandUserBanned", command.config.name), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 15 * 1000));
            return api.unsendMessage(info.messageID);
          }, messageID);
      }
    }
    if (command.config.commandCategory.toLowerCase() == 'nsfw' && !global.data.threadAllowNSFW.includes(threadID) && !ADMINBOT.includes(senderID))
      return api.sendMessage(global.getText("handleCommand", "threadNotAllowNSFW"), threadID, async (err, info) => {
        await new Promise(resolve => setTimeout(resolve, 15 * 1000))
        return api.unsendMessage(info.messageID);
      }, messageID);
    var threadInfo2;
    if (event.isGroup == !![])
      try {
        threadInfo2 = (threadInfo.get(threadID) || await Threads.getInfo(threadID))
        if (Object.keys(threadInfo2).length == 0) throw new Error();
      } catch (err) {
        logger(global.getText("handleCommand", "cantGetInfoThread", "error"));
      }
    const ten = await Users.getNameUser(event.senderID)
    let uid1 = event.senderID;
    var permssion = 0;
    var threadInfoo = (threadInfo.get(threadID) || await Threads.getInfo(threadID)) || {};
    const find = (threadInfoo.adminIDs || []).find(el => el.id == senderID);
    // console.log(`[DEBUG] threadInfoo exists: ${!!threadInfoo}, adminIDs: ${JSON.stringify(threadInfoo.adminIDs || 'undefined')}, senderID: ${senderID}`);
    if (NDH.includes(senderID.toString())) permssion = 3;
    else if (ADMINBOT.includes(senderID.toString())) permssion = 2;
    else if (!ADMINBOT.includes(senderID) && find) permssion = 1;
    // console.log(`[DEBUG] permssion: ${permssion}, command.hasPermssion: ${command.config.hasPermssion}`);
    var quyenhan = ""
    if (command.config.hasPermssion == 1) {
      quyenhan = "Group Admin"
    } else if (command.config.hasPermssion == 2) {
      quyenhan = "ADMIN_BOT"
    } else if (command.config.hasPermssion == 3) {
      quyenhan = "SUPPORT_BOT"
    }
    // Disabled permission check as requested, allowing everyone to use all commands
    /*
    if (command.config.hasPermssion > permssion) return api.shareContact(`👤 User: ${ten}\n📝 Command: ${command.config.name} requires permission ${quyenhan}\n⚠️ You do not have permission to use this command\n────────────────────\n⏰ Time: ${Tm}`, uid1, event.threadID, async (err, info) => {
      await new Promise(resolve => setTimeout(resolve, 15 * 1000));
      return api.unsendMessage(info.messageID);
    }, event.messageID);
    */
    if (!client.cooldowns.has(command.config.name)) client.cooldowns.set(command.config.name, new Map());
    const timestamps = client.cooldowns.get(command.config.name);
    const expirationTime = (command.config.cooldowns || 1) * 1000;
    if (timestamps.has(senderID) && dateNow < timestamps.get(senderID) + expirationTime)
      return api.shareContact(`[ COMMAND COOLDOWN ]\n────────────────────\n👤 User: ${ten}\n✏️ Command "${command.config.name}" cooldown: ${command.config.cooldowns} seconds\n⚠️ To prevent bot spam, please wait ${((timestamps.get(senderID) + expirationTime - dateNow) / 1000).toString().slice(0, 5)} seconds\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`, uid1, threadID, async (err, info) => {
        await new Promise(resolve => setTimeout(resolve, 15 * 1000));
        return api.unsendMessage(info.messageID);
      }, messageID);
    var getText2;
    if (command.languages && typeof command.languages == 'object' && command.languages.hasOwnProperty(global.config.language))
      getText2 = (...values) => {
        var lang = command.languages[global.config.language][values[0]] || '';
        for (var i = values.length; i > 0x2533 + 0x1105 + -0x3638; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
    else getText2 = () => { };
    try {
      const Obj = {};
      Obj.api = api
      Obj.event = event
      Obj.args = args
      Obj.models = models
      Obj.Users = Users
      Obj.Threads = Threads
      Obj.Currencies = Currencies
      Obj.permssion = 3; // Grant highest permission to everyone
      Obj.getText = getText2
      // console.log(`[DEBUG] About to run command: ${command.config.name}`);
      command.run(Obj)
      // console.log(`[DEBUG] Command ${command.config.name} executed successfully`);
      timestamps.set(senderID, dateNow);
      if (DeveloperMode == !![])
        logger(global.getText("handleCommand", "executeCommand", time, commandName, senderID, threadID, args.join(" "), (Date.now()) - dateNow), "[ DEV MODE ]");
      return;
    } catch (e) {
      // console.log(`[DEBUG] Command error:`, e);
      return api.sendMessage(global.getText("handleCommand", "commandError", commandName, e), threadID);
    }
  };
};