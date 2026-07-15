module.exports.config = {
  name: "admin",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "Trịnh Đình Phát",
  description: "Toggle admin-only command mode",
  commandCategory: "Users",
  usages: "Toggle admin-only command mode",
  cooldowns: 0,
  usePrefix: false,
  images: [],
  dependencies: {
    "fs-extra": ""
  }
};

module.exports.languages = {
  "vi": {
    "notHavePermssion": '⚠️ You don\'t have permission to use "%1"',
    "addedNewAdmin": '[ ADD NEW ADMIN ]\n────────────────────\n📝 Successfully added %1 users as bot admins\n\n%2\n────────────────────\n[⏰] → Time: %3',
    "removedAdmin": '[ REMOVE ADMIN ]\n────────────────────\n📝 Successfully removed %1 users back to members\n\n%2\n────────────────────\n[⏰] → Time: %3'
  },
  "en": {
    "listAdmin": '[Admin] Admin list: \n\n%1',
    "notHavePermssion": '[Admin] You have no permission to use "%1"',
    "addedNewAdmin": '[Admin] Added %1 Admin :\n\n%2',
    "removedAdmin": '[Admin] Remove %1 Admin:\n\n%2'
  }
}
module.exports.onLoad = function () {
  const { writeFileSync, existsSync } = require('fs-extra');
  const { resolve } = require("path");
  const path = resolve(__dirname, 'data', 'dataAdbox.json');
  if (!existsSync(path)) {
    const obj = {
      adminbox: {}
    };
    writeFileSync(path, JSON.stringify(obj, null, 4));
  } else {
    const data = require(path);
    if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
    writeFileSync(path, JSON.stringify(data, null, 4));
  }
}
module.exports.run = async function ({ api, event, args, Users, permssion, getText, Currencies }) {
  const fs = require("fs-extra");
  const axios = require("axios");
  const moment = require("moment-timezone");
  const gio = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY - HH:mm:ss");
  const nd = await Users.getNameUser(event.senderID);
  const { PREFIX } = global.config;
  const { threadID, messageID, mentions, senderID } = event;
  const { configPath } = global.client;
  const { throwError } = global.utils;

  async function streamURL(url, mime = 'jpg') {
    const dest = `${__dirname}/cache/${Date.now()}.${mime}`;
    const downloader = require('image-downloader');
    const fse = require('fs-extra');
    await downloader.image({
      url, dest
    });
    setTimeout(j => fse.unlinkSync(j), 60 * 1000, dest);
    return fse.createReadStream(dest);
  }

  const allowedUserIDs = global.config.NDH.map(id => id.toString());
  const senderIDStr = senderID.toString();
  const threadSetting = global.data.threadData.get(threadID) || {};
  const pref = threadSetting.PREFIX || PREFIX;
  const content = args.slice(1, args.length);
  if (args.length == 0)
    return api.sendMessage(`[ ADMIN CONFIG SETTING ]\n──────────────────\n${pref}admin add: add user as admin\n${pref}admin remove: remove admin role\n${pref}admin list: view admin list\n${pref}admin qtvonly: toggle group admin mode\n${pref}admin only: toggle infinity mode\n${pref}admin echo: bot will echo your message\n${pref}admin fast: check bot network speed\n${pref}admin create [module name]: create new file in commands\n${pref}admin del [module name]: delete file in commands\n${pref}admin rename [module name] => [new name]: rename file in commands\n${pref}admin ping: check bot response speed\n${pref}admin offbot: turn off bot\n${pref}admin reload [time]: reset bot system\n${pref}admin resetmoney: reset all money on bot system\n${pref}admin ship [module name]: send a module to group members\n──────────────────\n📝 Usage: ${pref}admin + [text] command to use`, event.threadID, event.messageID);
  const { ADMINBOT } = global.config;
  const { NDH } = global.config;
  const { userName } = global.data;
  const { writeFileSync } = require("fs-extra");
  const mention = Object.keys(mentions);

  delete require.cache[require.resolve(configPath)];
  var config = require(configPath);
  switch (args[0]) {
    case "list": {
      var i = 1;
      var msg = [];
      const listAdmin = config.ADMINBOT || [];
      let count = 1;

      // Loop through admin list and create display message
      for (const idAdmin of listAdmin) {
        if (parseInt(idAdmin)) {
          const name = (await Users.getData(idAdmin)).name;
          msg.push(`${count}. 👤: ${name}\n📎 Link: fb.com/${idAdmin}`);
          count++;
        }
      }

      // Send admin list and prompt reply to delete
      api.sendMessage(`[ Bot Operator ]\n──────────────────\n👤 Name: ${global.config.ADMIN_NAME}\n📎 Facebook: ${global.config.FACEBOOK_ADMIN}\n📩 Admin Dang Gia Khanh project\n──────────────────\n\n[ ADMIN BOT ]\n──────────────────\n${msg.join("\n")}\n──────────────────\n👤 User: ${nd}\n⏰ Time: ${gio}\n\nReply to this message with ordinal numbers to delete corresponding admin IDs (e.g., "1 2 3").`, event.threadID, (error, info) => {
        if (!error) {
          global.client.handleReply.push({
            name: "deleteAdmin",
            messageID: info.messageID,
            author: event.senderID,
            type: 'replyToDeleteAdmin',
            data: { listAdmin }
          });
        }
      });

      // Handle reply messages to delete admin
      api.listenMqtt((err, message) => {
        const replyData = global.client.handleReply.find(r => r.name === "deleteAdmin" && r.messageID === message.messageReply?.messageID);

        if (replyData && replyData.author === message.senderID) {
          const indices = message.body.split(" ").map(num => parseInt(num) - 1).filter(index => !isNaN(index) && index >= 0 && index < replyData.data.listAdmin.length);
          const idsToDelete = indices.map(index => replyData.data.listAdmin[index]);

          if (idsToDelete.length > 0) {
            // Remove admin IDs from list
            idsToDelete.forEach(id => {
              const index = replyData.data.listAdmin.indexOf(id);
              if (index > -1) replyData.data.listAdmin.splice(index, 1);
            });

            api.sendMessage(`Removed admins with ID: ${idsToDelete.join(", ")}`, message.threadID, message.messageID);

            // Update admin list in config and save to config file
            config.ADMINBOT = replyData.data.listAdmin;
            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
          } else {
            api.sendMessage("No valid ordinal numbers found!", message.threadID, message.messageID);
          }
        }
      });

      break;
    }
    case "add": {
      if (!ADMINBOT.includes(senderIDStr) && !NDH.includes(senderIDStr)) return api.sendMessage(`⚠️ Admin permission required to execute command`, event.threadID, event.messageID);
      if (permssion < 2) return api.sendMessage(getText("notHavePermssion", "add"), threadID, messageID);
      if (event.type == "message_reply") { content[0] = event.messageReply.senderID }
      if (mention.length != 0 && isNaN(content[0])) {
        var listAdd = [];

        for (const id of mention) {
          ADMINBOT.push(id);
          config.ADMINBOT.push(id);
          listAdd.push(`[👤] → Name: ${event.mentions[id]}\n[🔰] → Uid: ${id}`);
        };
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage({ body: getText("addedNewAdmin", mention.length, listAdd.join("\n").replace(/\@/g, ""), moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss")), attachment: await streamURL(`https://graph.facebook.com/${mention}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`) }, event.threadID)
      }
      else if (content.length != 0 && !isNaN(content[0])) {
        ADMINBOT.push(content[0]);
        config.ADMINBOT.push(content[0]);
        const name = (await Users.getData(content[0])).name
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage({ body: getText("addedNewAdmin", 1, `[👤] → Name: ${name}\n[🔰] → Uid: ${content[0]}`, moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss")), attachment: await streamURL(`https://graph.facebook.com/${content[0]}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`) }, event.threadID)
      }
      else return throwError(this.config.name, threadID, messageID);
    }
    case "removeAdmin":
    case "rm":
    case "delete": {
      if (!ADMINBOT.includes(senderIDStr) && !NDH.includes(senderIDStr)) return api.sendMessage(`⚠️ Admin permission required to execute command`, event.threadID, event.messageID);
      if (permssion < 2) return api.sendMessage(getText("notHavePermssion", "removeAdmin"), threadID, messageID);
      if (event.type == "message_reply") { content[0] = event.messageReply.senderID }
      if (mentions.length != 0 && isNaN(content[0])) {
        const mention = Object.keys(mentions);
        var listAdd = [];

        for (const id of mention) {
          const index = config.ADMINBOT.findIndex(item => item == id);
          ADMINBOT.splice(index, 1);
          config.ADMINBOT.splice(index, 1);
          listAdd.push(`[👤] → Name: ${event.mentions[id]}\n[🔰] → Uid: ${id}`);
        };

        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(getText("removedAdmin", mention.length, listAdd.join("\n").replace(/\@/g, ""), moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss")), threadID, messageID);
      }
      else if (content.length != 0 && !isNaN(content[0])) {
        const index = config.ADMINBOT.findIndex(item => item.toString() == content[0]);
        ADMINBOT.splice(index, 1);
        config.ADMINBOT.splice(index, 1);
        const name = (await Users.getData(content[0])).name
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(getText("removedAdmin", 1, `[👤] → Name: ${name}\n[🔰] → Uid: ${content[0]}`, moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss")), threadID, messageID);
      }
      else throwError(this.config.name, threadID, messageID);
    }
    case 'qtvonly': {
      const { resolve } = require("path");
      const pathData = resolve(__dirname, 'data', 'dataAdbox.json');
      const database = require(pathData);
      const { adminbox } = database;
      if (permssion < 1) return api.sendMessage("⚠️ Admin permission required to execute command", threadID, messageID);
      if (adminbox[threadID] == true) {
        adminbox[threadID] = false;
        api.sendMessage("☑️ Successfully turned off admin-only mode, all members can use the bot", threadID, messageID);
      } else {
        adminbox[threadID] = true;
        api.sendMessage("☑️ Activated admin-only mode, only group admins can use the bot", threadID, messageID);
      }
      writeFileSync(pathData, JSON.stringify(database, null, 4));
      break;
    }
    case 'only':
    case '-o': {
      //---> CODE ADMIN ONLY<---//
      if (permssion != 3) return api.sendMessage("⚠️ You are not the main admin", threadID, messageID);
      if (config.adminOnly == false) {
        config.adminOnly = true;
        api.sendMessage(`☑️ Activated infinity mode, only Admins can use the bot`, threadID, messageID);
      } else {
        config.adminOnly = false;
        api.sendMessage(`☑️ Turned off infinity mode, all members can use the bot`, threadID, messageID);
      }
      writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
      break;
    }
    case 'echo': {
      const input = args.join(" ");
      const spaceIndex = input.indexOf(' ');

      if (spaceIndex !== -1) {
        const textAfterFirstWord = input.substring(spaceIndex + 1).trim();
        return api.sendMessage(textAfterFirstWord, event.threadID);
      }
      break;
    }
    case 'fast': {
      try {
        const fast = require("fast-speedtest-api");
        const speedTest = new fast({
          token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
          verbose: false,
          timeout: 10000,
          https: true,
          urlCount: 5,
          bufferSize: 8,
          unit: fast.UNITS.Mbps
        });
        const result = await speedTest.getSpeed();
        return api.sendMessage(`🚀 Speed Test: ${result} Mbps`, event.threadID, event.messageID);
      } catch (error) {
        return api.sendMessage("⚠️ Cannot measure speed right now, please try again later!", event.threadID, event.messageID);
      }
      break;
    }
    case 'create': {
      if (!allowedUserIDs.includes(senderIDStr)) {
        return api.sendMessage(`⚠️ Main admin permission required to execute command`, event.threadID, event.messageID);
      }

      if (args.slice(1).length === 0) return api.sendMessage("⚠️ Please enter a name for your file", event.threadID);

      const commandName = args.slice(1).join(' ');
      const filePath = `${__dirname}/${commandName}.js`;

      if (fs.existsSync(filePath)) {
        return api.sendMessage(`⚠️ File ${commandName}.js already exists`, event.threadID, event.messageID);
      }

      fs.copySync(`${__dirname}/example.js`, filePath);
      return api.sendMessage(`☑️ Successfully created file "${commandName}.js"`, event.threadID, event.messageID);
      break;
    }
    case 'del': {
      if (!allowedUserIDs.includes(senderIDStr)) {
        return api.sendMessage(`⚠️ Main admin permission required to execute command`, event.threadID, event.messageID);
      }
      const commandName = args.slice(1).join(' ');
      if (!commandName) return api.sendMessage(`⚠️ Please provide the command name to delete`, event.threadID, event.messageID);

      fs.unlink(`${__dirname}/${commandName}.js`, (err) => {
        if (err) return api.sendMessage(`❎ Failed to delete file ${commandName}.js: ${err.message}`, event.threadID, event.messageID);
        return api.sendMessage(`☑️ Successfully deleted file ${commandName}.js`, event.threadID, event.messageID);
      });
      break;
    }
    case 'rename': {
      if (!allowedUserIDs.includes(senderIDStr)) {
        return api.sendMessage(`⚠️ Main admin permission required to execute command`, event.threadID, event.messageID);
      }
      const renameArgs = args.slice(1).join(' ').split('=>');

      if (renameArgs.length !== 2) {
        return api.sendMessage(`⚠️ Please enter the correct format [module name] => [new name]`, event.threadID, event.messageID);
      }

      const oldName = renameArgs[0].trim();
      const newName = renameArgs[1].trim();

      fs.rename(`${__dirname}/${oldName}.js`, `${__dirname}/${newName}.js`, function (err) {
        if (err) throw err;
        return api.sendMessage(
          `☑️ Renamed file ${oldName}.js to ${newName}.js`,
          event.threadID,
          event.messageID
        );
      });
      break;
    }
    case 'ping': {
      const timeStart = Date.now();
      const pingrs = Date.now() - timeStart;
      api.sendMessage(`📶 Response ping: ${pingrs} ms`, event.threadID, event.messageID);
      break;
    }
    case 'offbot': {
      if (!allowedUserIDs.includes(senderIDStr)) {
        return api.sendMessage(`⚠️ Main admin permission required to execute command`, event.threadID, event.messageID);
      }
      api.sendMessage("☠️ Bye bye", event.threadID, () => process.exit(0))
      break;
    }
    case 'reload': {
      if (!allowedUserIDs.includes(senderIDStr)) {
        return api.sendMessage(`⚠️ Main admin permission required to execute command`, event.threadID, event.messageID);
      }

      const { commands } = global.client;
      const pidusage = await global.nodemodule["pidusage"](process.pid);
      const os = require("os");
      const cpus = os.cpus();
      let chips, speed;

      for (const cpu of cpus) {
        chips = cpu.model;
        speed = cpu.speed;
      }

      const timeStart = Date.now();
      const { threadID, messageID } = event;
      const time = args.join(" ");
      let rstime = "68";

      if (time) {
        rstime = time;
      }

      api.sendMessage(`[ RELOAD SYSTEM ]\n──────────────────\n[⚙️] → Bot will reset after ${rstime} seconds\n[⏰] → Time: ${gio}\n[📊] → Processing speed: ${speed}MHz\n[↪️] → CPU threads: ${os.cpus().length}\n[📶] → Latency: ${Date.now() - timeStart}ms`, event.threadID, event.messageID);

      setTimeout(() => {
        api.sendMessage("[💨] → Bot Is Resetting System!", event.threadID, () => process.exit(1));
      }, rstime * 1000);

      break;
    }
    case "resetmoney": {
      if (!allowedUserIDs.includes(senderIDStr)) {
        return api.sendMessage(`⚠️ Main admin permission required to execute command`, event.threadID, event.messageID);
      }

      const mentionID = Object.keys(event.mentions);
      const message = [];
      const error = [];

      const resetMoneyForUser = async (userID) => {
        try {
          await Currencies.setData(userID, { money: 0 });
          message.push(userID);
        } catch (e) {
          error.push(e);
        }
      };

      const allUserData = await Currencies.getAll(['userID']);

      for (const userData of allUserData) {
        await resetMoneyForUser(userData.userID);
      }

      api.sendMessage(`✅ Deleted all money data of ${message.length} users`, event.threadID, async () => {
        if (error.length !== 0) {
          await api.sendMessage(`❎ Cannot delete money data of ${error.length} users`, event.threadID);
        }
      }, event.messageID);

      for (const singleID of mentionID) {
        await resetMoneyForUser(singleID);
      }

      api.sendMessage(`✅ Deleted money data of ${message.length} users`, event.threadID, async () => {
        if (error.length !== 0) {
          await api.sendMessage(`❎ Cannot delete money data of ${error.length} users`, event.threadID);
        }
      }, event.messageID);

      break;
    }

    case 'ship': {
      if (!allowedUserIDs.includes(senderIDStr)) {
        return api.sendMessage(`⚠️ Main admin permission required to execute command`, event.threadID, event.messageID);
      }

      const { messageReply, type } = event;

      let name = args[1];
      const commandName = args.slice(1).join(' ');

      let text, uid;
      if (type === "message_reply") {
        text = messageReply.body;
        uid = messageReply.senderID;
      } else {
        uid = event.senderID;
      }

      if (!text && !name) {
        return api.sendMessage(`[⏰] → Time: ${gio}\n[📝] → Please reply or tag the person you want to share with`, event.threadID, event.messageID);
      }

      fs.readFile(`./modules/commands/${commandName}.js`, "utf-8", async (err, data) => {
        if (err) {
          return api.sendMessage(`[⏰] → Time: ${gio}\n[🔎] → Sorry, the module ${commandName} you need is not available on bot ${global.config.BOTNAME}`, event.threadID, event.messageID);
        }

        const response = await axios.post("https://api.mocky.io/api/mock", {
          "status": 200,
          "content": data,
          "content_type": "application/json",
          "charset": "UTF-8",
          "secret": "PhamMinhDong",
          "expiration": "never"
        });

        const link = response.data.link;
        const use = await Users.getNameUser(uid);
        api.sendMessage(`[📜] → Group: ${global.data.threadInfo.get(event.threadID).threadName}\n[⏰] → At: ${gio}\n[💼] → Command: ${commandName}\n[👤] → Admin: ${nd}\n[📌] → Module sent ☑️\n[📝] → ${use} please check pending or spam messages to receive the module`, event.threadID, event.messageID);
        api.sendMessage(`[⏰] → At: ${gio}\n[🔗] → Link: ${link}\n[🔰] → Command: ${commandName}\n[📜] → Group: ${global.data.threadInfo.get(event.threadID).threadName}\n[🔎] → You have been privately shared a module by admin`, uid);
      });

      break;
    }
    default: {
      return throwError(this.config.name, threadID, messageID);
    }
  }
}
