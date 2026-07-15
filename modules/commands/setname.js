const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: 'setname',
    version: '4.0.0',
    hasPermssion: 0,
    Rent: 1,
    credits: 'Vtuan | Cthinh',
    description: 'Change nickname in your group or of the person you tag',
    commandCategory: 'User',
    usages: '[empty/reply/tag] + [name]',
    usePrefix: false,
    cooldowns: 0
};

module.exports.run = async ({ api, event, args, Users }) => {
    const filePath = path.join(__dirname, './../../modules/commands/data/setname.json');
    const mention = Object.keys(event.mentions)[0];
    let { threadID, messageReply, senderID, mentions, type } = event;
  
    if (!fs.existsSync(filePath)) {
        fs.writeJsonSync(filePath, []);
        api.sendMessage('Data created. please use the command again!', threadID);
        return;
    }

    const jsonData = fs.readJsonSync(filePath);
    const existingData = jsonData.find(data => data.id_Nhóm === threadID);

    if (args.length > 0 && args[0].toLowerCase() === 'add') {
        if (args.length < 2) {
            api.sendMessage('Please enter the character.', threadID);
            return;
        }
        const newData = { id_Nhóm: threadID, kí_tự: args.slice(1).join(' ') || '' };
        if (existingData) {
            existingData.kí_tự = newData.kí_tự;
        } else {
            jsonData.push(newData);
        }
        fs.writeJsonSync(filePath, jsonData);
        api.sendMessage('Setname character updated.', threadID);
        return;
    }

    if (args.length > 0 && args[0].toLowerCase() === 'help') {
        api.sendMessage('📑Usage:\n- setname add [character]: Add setname character\n- setname + name: Change nickname\n- setname check: to see who does not have a nickname in the group', threadID);
        return;
    }

  if (args.length > 0 && args[0].toLowerCase() === 'check') {
    try {
      let threadInfo = await api.getThreadInfo(event.threadID);
      let u = threadInfo.nicknames || {};
      let participantIDs = threadInfo.participantIDs;
      let listbd = participantIDs.filter(userID => !u[userID]);

      if (listbd.length > 0) {
        let listNames = [];
        let listMentions = [];

        for (let [index, userID] of listbd.entries()) {
          try {
            let userInfo = await Users.getInfo(userID);
            let name = userInfo.name || "User has no name";
            listNames.push(`${index + 1}. ${name}`);
            listMentions.push({ tag: `@${name}`, id: userID });
          } catch (error) {
            console.error(`Error getting user info for ID: ${userID}`);
          }
        }
        if (listNames.length > 0) {
          let message = `😌- List of people without nickname:\n${listNames.join("\n")}`;
          if (event.body.includes("call")) {
            message += "\n\nPlease set a nickname for yourself!";
            api.sendMessage({ body: `wake up and set a nickname :<`, mentions: listMentions }, event.threadID);
          } else if (event.body.includes("del")) {
            let isAdmin = threadInfo.adminIDs.some(item => item.id == event.senderID);
            if (isAdmin) {
              for (let userID of listbd) {
                api.removeUserFromGroup(userID, event.threadID);
              }
              message += "\n\nRemoved people without nickname from the group.";
              api.sendMessage(message, event.threadID);
            } else {
              message += "\n\nYou do not have permission to remove others from the group.";
              api.sendMessage(message, event.threadID);
            }
          } else if (event.body.includes("help")) {
            message = `📔~ The check command is used to check members in the group without a nickname.\nUsage: check [call | del | help]\n\n- check: only displays the list of people without a nickname.\n- check call: tag all people without a nickname and send a message to set a nickname.\n- check del: remove all people without a nickname from the group (admin only).\n- check help: displays instructions on how to use this command.`;
            api.sendMessage(message, event.threadID);
          } else {
            message += "\n\n- use check help to see how to use all features of the command.";
            api.sendMessage(message, event.threadID);
          }
        } else {
          api.sendMessage(`✅No one is without a nickname.`, event.threadID);
        }
      } else {
        api.sendMessage(`✅All members already have nicknames.`, event.threadID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage('❌An error occurred while executing the nickname check function.', event.threadID);
    }
      return;
  }
  if (args.length > 0 && args[0].toLowerCase() === 'all') {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const idtv = threadInfo.participantIDs;
      const nameToChange = args.slice(1).join(" ");

      function delay(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
      };

      for (let setname of idtv) {
          let newName = nameToChange;

          if (existingData) {
              const senderName = await Users.getNameUser(event.senderID);
              const kt = existingData.kí_tự;
              newName = kt + ' ' + senderName;
          }

          await delay(100);
          await api.changeNickname(newName, event.threadID, setname);
      }

      api.sendMessage('✅Changed nickname for all members in the group.', event.threadID);
      return;
  }
  
  if (existingData) {
      const kt = existingData.kí_tự;
      let name = await Users.getNameUser(event.senderID);
      const names = args.length > 0 ? args.join(' ') : `${name}`;
      if (names.indexOf('@') !== -1) {
          api.changeNickname(`${kt} ${names.replace(mentions[mention], "")}`, threadID, mention, e => !e ? api.sendMessage(`${!args[0] ? 'Remove' : 'Change'} nickname complete!\nUse setname help to see all command features`, event.threadID) : api.sendMessage(`[ ! ] - the group currently has join link enabled so the bot cannot set nickname for users, please disable the invite link to use this feature!`, event.threadID));
      } else {
          api.changeNickname(`${kt} ${names}`, threadID, event.type == 'message_reply' ? event.messageReply.senderID : event.senderID, e => !e ? api.sendMessage(`${!args[0] ? 'Remove' : 'Change'} nickname complete!\nUse setname help to see all command features`, event.threadID) : api.sendMessage(`[ ❌ ] - the group currently has join link enabled so the bot cannot set nickname for users, please disable the invite link to use this feature!`, event.threadID));
      }
  } else {
        if (args.join().indexOf('@') !== -1) {
            const name = args.join(' ');
            api.changeNickname(`${name.replace(mentions[mention], "")}`, threadID, mention, e => !e ? api.sendMessage(`${!args[0] ? 'Remove' : 'Change'} nickname complete!\nUse setname help to see all command features`, event.threadID) : api.sendMessage(`[ ! ] - the group currently has join link enabled so the bot cannot set nickname for users, please disable the invite link to use this feature!`, event.threadID));
        } else {
            api.changeNickname(args.join(' '), event.threadID, event.type == 'message_reply' ? event.messageReply.senderID : event.senderID, e => !e ? api.sendMessage(`${!args[0] ? 'Remove' : 'Change'} nickname complete!\nUse setname help to see all command features`, event.threadID) : api.sendMessage(`[ ! ] - the group currently has join link enabled so the bot cannot set nickname for users, please disable the invite link to use this feature!`, event.threadID));
        }
    }
};