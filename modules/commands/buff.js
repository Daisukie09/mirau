const axios = require('axios');
const fs = require('fs');

module.exports.config = {
  name: "buff",
  version: "1.0.0",
  hasPermssion: 0,
  Rent: 1,
  credits: "Dũngkon || vtuan",
  description: "Buff likes, reactions, follows",
  commandCategory: "Utilities",
  usages: "buff like/cx/sub",
  cooldowns: 6,
};

const fetchTDSAccounts = async () => {
  const tokens = [
    'TDS0nI5IXZ2V2ciojIyVmdlNnIsIyMzEzZnlHTiojIyV2c1Jye'
  ];
  var cookies = [
    "PHPSESSID=cd06c4010a6354ff03f39dafcb0aefc7"
  ];
var cookie = cookies[Math.floor(Math.random() * cookies.length)];
  const accountPromises = tokens.map(token =>
    axios.get(`https://traodoisub.com/api/?fields=profile&access_token=${token}`)
      .then(response => response.data)
      .catch(error => ({ error: error.message }))
  );
  return Promise.all(accountPromises);
};

const getAccountInfo = (accounts) => {
  return accounts.map(acc => `🛡ACCOUNT: ${acc.data.user}\n💰CURRENT XU: ${parseInt(acc.data.xu).toLocaleString()}`).join('\n');
};

const getResponseMessage = (data, link, sl, cost, accounts) => {
  return `[ BUFF ]\nSTATUS: ${data.data}\nLINK/ID: ${link}\nQUANTITY: ${sl}\nAmount Deducted: ${parseInt(cost).toLocaleString()} VND\n${getAccountInfo(accounts)}\nNote: This buff is sourced from a sub exchange website so it may not be fast`;
};

const filePath = "./modules/commands/cache/DATA_MONEY.json";
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));

const money1 = 10;
const money2 = 13;
const money3 = 13;
const money4 = 7;
const money5 = 35;
const money6 = 25;

const checkBalance = (mn, required) => {
  return mn && mn.input >= required;
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, messageReply, mentions } = event;
const { PREFIX } = global.config; 
 const threadSetting = global.data.threadData.get(threadID) || {};
 const prefix = threadSetting.PREFIX || PREFIX; 
  const out = (msg) => api.sendMessage(msg, threadID, messageID);

  let read = fs.readFileSync(filePath, 'utf-8');
  let checkmn = read ? JSON.parse(read) : [];

  let mn = checkmn.find(e => e.senderID === parseInt(senderID));

  if (args[0] === 'set') {
    const { ADMINBOT } = global.config;
    if (!ADMINBOT.includes(senderID)) return out(`You cannot use this!`);

    let newSenderID, input;
    if (messageReply) {
      newSenderID = parseInt(messageReply.senderID);
      input = parseInt(args[1].trim());
    } else if (mentions && Object.keys(mentions).length > 0) {
      newSenderID = parseInt(Object.keys(mentions)[0]);
      input = parseInt(args[2]);
    } else {
      [newSenderID, input] = args.slice(1).join(' ').split('|').map(str => parseInt(str.trim()));
    }

    const e = checkmn.findIndex(entry => entry.senderID === newSenderID);
    if (e !== -1) {
      checkmn[e].input += input;
      checkmn[e].lsnap.push({ time: Date.now(), input: input });
    } else {
      const newEntry = {
        senderID: newSenderID,
        input: input,
        historic: [],
        db: false,
        lsnap: [{ time: Date.now(), input: input }]
      };
      checkmn.push(newEntry);
    }
    fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
    return out(`Added money for user with ID: ${newSenderID}`);
  } else if (args[0] == 'check') {
    if (args[1] && args[1].toLowerCase() === 'all') {
      let allData = "";
      for (let i = 0; i < checkmn.length; i++) {
        const user = checkmn[i];
        let history = user.historic.map((item, index) => `${index + 1}. Command: ${item.type} | ID/Link: ${item.idOrLink} | Quantity: ${item.sl}`).join('\n');

        // Data from lsnap
        let lsnapData = "";
        if (user.lsnap && user.lsnap.length > 0) {
          lsnapData = user.lsnap.map((snap, index) => `${index + 1}. Time: ${snap.time}, Amount: ${parseInt(snap.input).toLocaleString()}`).join('\n');
        } else {
          lsnapData = "No deposit data.";
        }

        allData += `User: ${user.senderID}\nBalance: ${parseInt(user.input).toLocaleString()} VND\nUsage history:\n${history}\nDeposit history:\n${lsnapData}\n\n`;
      }
      return out(`All user data:\n${allData}`);
    }

    const uid = messageReply && messageReply.senderID || (mentions && Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : event.senderID);
    let dt = checkmn.find(e => e.senderID === parseInt(uid));

    if (!dt) {
      return out('Your account has no data yet.');
    }

    const history = dt.historic.map((item, index) => `${index + 1}. Command: ${item.type} | ID/Link: ${item.idOrLink} | Quantity: ${item.sl}`).join('\n');

    // Display data from lsnap
    let lsnapData = "";
    if (dt.lsnap && dt.lsnap.length > 0) {
      lsnapData = dt.lsnap.map((snap, index) => `${index + 1}. Time: ${snap.time}, Amount: ${parseInt(snap.input).toLocaleString()}`).join('\n');
    } else {
      lsnapData = "No deposit data.";
    }

    return out(`Balance: ${parseInt(dt.input).toLocaleString()} VND\nUsage history:\n${history}\nDeposit history:\n${lsnapData}`);
  }

  else if (args[0] == "del") {
    const { ADMINBOT } = global.config;
    if (!ADMINBOT.includes(senderID)) return out("You cannot use this!");

    let newSenderID, input;
    if (messageReply) {
      newSenderID = parseInt(messageReply.senderID);
      input = args[1].trim() === 'all' ? 'all' : parseInt(args[1].trim());
    } else if (mentions && Object.keys(mentions).length > 0) {
      newSenderID = parseInt(Object.keys(mentions)[0]);
      input = args[2] === 'all' ? 'all' : parseInt(args[2]);
    } else {
      [newSenderID, input] = args.slice(1).join(" ").split("|").map(str => str.trim() === 'all' ? 'all' : parseInt(str.trim()));
    }

      const e = checkmn.findIndex(entry => entry.senderID === newSenderID);
    if (e !== -1) {
      if (input === 'all') {
        checkmn[e].input = 0;
      } else {
        if (checkmn[e].input < input) {
          return out("Insufficient balance.");
        }
        checkmn[e].input -= input;
      }
    } else {
      return out("Insufficient balance.");
    }

    fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), "utf-8");
    return out(input === 'all' ? `Removed all VND from user with ID: ${newSenderID}` : `Deducted ${parseInt(input).toLocaleString()} VND from user with ID: ${newSenderID}`);
  }
  //   } else if (args[0] == 'db') {
  //     const { ADMINBOT } = global.config;
  //     if (!ADMINBOT.includes(senderID)) return out("You cannot use this!");

  //     const uid = messageReply && messageReply.senderID || (mentions && Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : event.senderID);

  //     const e = checkmn.findIndex(entry => entry.senderID === uid);
  //     if (e !== -1) {
  //         checkmn[e].db = !checkmn[e].db;
  //         fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
  //         return out(`Database status of user with ID ${uid} has been toggled to: ${checkmn[e].db}`);
  //     } else {
  //         return out("User data not found.");
  //     }
  // }




  const accounts = await fetchTDSAccounts();

  const url = `https://img.vietqr.io/image/MB-1234567897749-print.png?addInfo=${senderID}&accountName=NGUYEN%20DINH%20TIEN%20DUNG`;

  const imagePath = `./modules/commands/cache/anh_${senderID}.png`;

  if (!args.join(" ")) {
    return out(`===== Guide =====
        + FACEBOOK +
⥤ ${prefix}buff cx | quantity | id | reaction type LOVE, HAHA, CARE, SAD, ANGRY, WOW | speed (enter number, 1 fast 2 slow)
⥤ ${prefix}buff like | quantity | id | speed (enter number, 1 fast 2 slow) | album (has album enter ok, no album enter not)
⥤ ${prefix}buff sub | quantity | uid
⥤ ${prefix}buff cmt | quantity | id | comment content
        + TIKTOK +
⥤ ${prefix}buff yeuthichtt | quantity | link
⥤ ${prefix}buff timtt | quantity | link
        + SYSTEM +
⥤ ${prefix}buff check (Check history and balance)
⥤ ${prefix}buff set + id | amount (Add money)
⥤ ${prefix}buff del + id | all (Delete all money)
\n\n===== TDS Account Info =====\n\n${getAccountInfo(accounts)}`);
  }

  if (!mn) {
    return axios.get(url, { responseType: "stream" })
      .then(response => {
        response.data.pipe(fs.createWriteStream(imagePath))
          .on('finish', () => {
            api.sendMessage({
              body: `Your Account Balance Is Insufficient Please Deposit More To Use The Service\nNote: Content Must Be Correct Facebook Uid (Min deposit 10k).\nBalance: 0 VND`,
              attachment: fs.createReadStream(imagePath)
            }, threadID);
          });
      });
  }

  const [command, sl, idOrLink, loaicx, sp] = args.join(" ").trim().replace(/\s+/g, " ").split("|").map(s => s.trim());

  try {
    let data;
    switch (command) {
      
      case 'timtt':
        var cookies = [
    "PHPSESSID=cd06c4010a6354ff03f39dafcb0aefc7"
  ];
var cookie = cookies[Math.floor(Math.random() * cookies.length)];
        if (sl > 70) return out("Quantity cannot exceed 70 hearts");
        if (!checkBalance(mn, money1 * sl)) {
          return axios.get(url, { responseType: "stream" }).then(response => {
            response.data.pipe(fs.createWriteStream(imagePath)).on('finish', () => {
              api.sendMessage({
                body: `Your Account Balance Is Insufficient Please Deposit More To Use The Service\nNote: Content Must Be Correct Facebook Uid (Min deposit 10k).\nBalance: ${parseInt(mn.input).toLocaleString()} VND`,
                attachment: fs.createReadStream(imagePath)
              }, threadID);
            });
          });
        }
        data = await global.utils.getContent(`https://vmlwb.io.vn/tt/tim?sl=${sl}&link=${idOrLink}&cookie=${cookie}`);
        console.log(data);
        console.log(`https://vmlwb.io.vn/tt/tim?sl=${sl}&link=${idOrLink}&cookie=${cookie}`);

        if (data.data == "Purchase successful!") {
          mn.input -= money1 * sl;
          if (!mn.historic) mn.historic = [];
          mn.historic.push({ type: 'timtt', idOrLink, sl });
          fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
        }else {
          return out(`Please try again!!`);
        }

        return out(getResponseMessage(data, idOrLink, sl, money1 * sl, accounts));

      case 'yeuthichtt':
        var cookies = [
    "PHPSESSID=cd06c4010a6354ff03f39dafcb0aefc7"
  ];
var cookie = cookies[Math.floor(Math.random() * cookies.length)];
        if (sl > 200) return out("Quantity cannot exceed 200 reactions");
        if (!checkBalance(mn, money2 * sl)) {
          return axios.get(url, { responseType: "stream" })
            .then(response => {
              response.data.pipe(fs.createWriteStream(imagePath))
                .on('finish', () => {
                  api.sendMessage({
                    body: `Your Account Balance Is Insufficient Please Deposit More To Use The Service\nNote: Content Must Be Correct Facebook Uid (Min deposit 10k).\nBalance: ${parseInt(mn.input).toLocaleString()} VND`,
                    attachment: fs.createReadStream(imagePath)
                  }, threadID);
                });
            });
        }
        data = await global.utils.getContent(`https://vmlwb.io.vn/tt/yeuthich?sl=${sl}&link=${idOrLink}&cookie=${cookie}`);
        console.log(data.data);
        console.log(`https://vmlwb.io.vn/tt/yeuthich?sl=${sl}&link=${idOrLink}&cookie=${cookie}`);

        if (data.data == "Purchase successful!") {
          mn.input -= money2 * sl;
          if (!mn.historic) mn.historic = [];
          mn.historic.push({ type: 'yeuthichtt', idOrLink, sl });
          fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
        }else {
          return out(`Please try again!!`);
        }

        return out(getResponseMessage(data, idOrLink, sl, money2 * sl, accounts));

      case 'sub':
        var cookies = [
    "PHPSESSID=cd06c4010a6354ff03f39dafcb0aefc7"
  ];
var cookie = cookies[Math.floor(Math.random() * cookies.length)];
        if (sl > 70) return out("Quantity cannot exceed 70 hearts");
        if (!checkBalance(mn, money5 * sl)) {
          return axios.get(url, { responseType: "stream" }).then(response => {
            response.data.pipe(fs.createWriteStream(imagePath)).on('finish', () => {
              api.sendMessage({
                body: `Your Account Balance Is Insufficient Please Deposit More To Use The Service\nNote: Content Must Be Correct Facebook Uid (Min deposit 10k).\nBalance: ${parseInt(mn.input).toLocaleString()} VND`,
                attachment: fs.createReadStream(imagePath)
              }, threadID);
            });
          });
        }
        data = await global.utils.getContent(`https://vmlwb.io.vn/fbfl?sl=${sl}&uid=${idOrLink}&cookie=${cookie}`);
        console.log(data.data);
        console.log(`https://vmlwb.io.vn/fbfl?sl=${sl}&uid=${idOrLink}&cookie=${cookie}`);

        if (data.data == "Purchase successful!") {
          mn.input -= money5 * sl;
          if (!mn.historic) mn.historic = [];
          mn.historic.push({ type: 'sub', idOrLink, sl });
          fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
        }else {
          return out(`Please try again!!`);
        }

        return out(getResponseMessage(data, idOrLink, sl, money5 * sl, accounts));

      case 'cx':
        var cookies = [
    "PHPSESSID=cd06c4010a6354ff03f39dafcb0aefc7"
  ];
var cookie = cookies[Math.floor(Math.random() * cookies.length)];
        if (sl > 70) return out("Quantity cannot exceed 70 reactions");
        if (!checkBalance(mn, money3 * sl)) {
          return axios.get(url, { responseType: "stream" })
            .then(response => {
              response.data.pipe(fs.createWriteStream(imagePath))
                .on('finish', () => {
                  api.sendMessage({
                    body: `Your Account Balance Is Insufficient Please Deposit More To Use The Service\nNote: Content Must Be Correct Facebook Uid (Min deposit 10k).\nBalance: ${parseInt(mn.input).toLocaleString()} VND`,
                    attachment: fs.createReadStream(imagePath)
                  }, threadID);
                });
            });
        }

        data = await global.utils.getContent(`https://vmlwb.io.vn/fbcx?sl=${sl}&id=${idOrLink}&loaicx=${loaicx}&sp=${sp}&cookie=${cookie}`);
        console.log(data);
        console.log(`https://vmlwb.io.vn/fbcx?sl=${sl}&id=${idOrLink}&loaicx=${loaicx}&sp=${sp}&cookie=${cookie}`);

        if (data.data == "Purchase successful!") {
          mn.input -= money3 * sl;
          if (!mn.historic) mn.historic = [];
          mn.historic.push({ type: 'cx', idOrLink, sl });
          fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
          return out(getResponseMessage(data, idOrLink, sl, money3 * sl, accounts));
        } else {
          return out(`Please try again!!`);
        }

      case 'cmt':
        var cookies = [
    "TDS0nI5IXZ2V2ciojIyVmdlNnIsIyMzEzZnlHTiojIyV2c1Jye"
  ];
var cookie = cookies[Math.floor(Math.random() * cookies.length)];
        if (sl > 40) return out("Quantity cannot exceed 40 comments");
        if (!checkBalance(mn, money6 * sl)) {
          return axios.get(url, { responseType: "stream" })
            .then(response => {
              response.data.pipe(fs.createWriteStream(imagePath))
                .on('finish', () => {
                  api.sendMessage({
                    body: `Your Account Balance Is Insufficient Please Deposit More To Use The Service\nNote: Content Must Be Correct Facebook Uid (Min deposit 10k).\nBalance: ${parseInt(mn.input).toLocaleString()} VND`,
                    attachment: fs.createReadStream(imagePath)
                  }, threadID);
                });
            });
        }

        data = await global.utils.getContent(`https://vmlwb.io.vn/fbcmt?sl=${sl}&id=${idOrLink}&noidung=${noidung}&cookie=${cookie}`);
        console.log(data.data);
        console.log(`https://vmlwb.io.vn/fbcmt?sl=${sl}&id=${idOrLink}&noidung=${sp}&cookie=${cookie}`);

        if (data.data == "Purchase successful!") {
          mn.input -= money6 * sl;
          if (!mn.historic) mn.historic = [];
          mn.historic.push({ type: 'cx', idOrLink, sl });
          fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
          return out(getResponseMessage(data, idOrLink, sl, money6 * sl, accounts));
        } else {
          return out(`Please try again!!`);
        }

      case 'like':
        var cookies = [
    "PHPSESSID=cd06c4010a6354ff03f39dafcb0aefc7"
  ];
var cookie = cookies[Math.floor(Math.random() * cookies.length)];
        if (sl > 70) return out("Quantity cannot exceed 70 likes");
        if (!checkBalance(mn, money4 * sl)) {
          return axios.get(url, { responseType: "stream" })
            .then(response => {
              response.data.pipe(fs.createWriteStream(imagePath))
                .on('finish', () => {
                  api.sendMessage({
                    body: `Your Account Balance Is Insufficient Please Deposit More To Use The Service\nNote: Content Must Be Correct Facebook Uid (Min deposit 10k).\nBalance: ${parseInt(mn.input).toLocaleString()} VND`,
                    attachment: fs.createReadStream(imagePath)
                  }, threadID);
                });
            });
        }

        data = await global.utils.getContent(`https://vmlwb.io.vn/fblike?sl=${sl}&id=${idOrLink}&sp=${sp}&alb=${loaicx}&cookie=${cookie}`);
        console.log(data.data);
        console.log(`https://vmlwb.io.vn/fblike?sl=${sl}&id=${idOrLink}&sp=${sp}&alb=${loaicx}&cookie=${cookie}`)

        if (data.data == "Purchase successful!") {
          mn.input -= money4 * sl;
          if (!mn.historic) mn.historic = [];
          mn.historic.push({ type: 'like', idOrLink, sl });
          fs.writeFileSync(filePath, JSON.stringify(checkmn, null, 4), 'utf-8');
          return out(getResponseMessage(data, idOrLink, sl, money4 * sl, accounts));
        } else {
          console.log(data.data)
          console.log(`https://vmlwb.io.vn/fblike?sl=${sl}&id=${idOrLink}&sp=${sp}&alb=${loaicx}&cookie=${cookie}`)
          return out(`Please try again!!`);
        }

      default:
        return out("Invalid command.");
    }
  } catch (error) {
    console.log(error)
    api.setMessageReaction("❌", messageID, () => { }, true);
  }
};