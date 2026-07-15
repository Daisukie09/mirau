module.exports.config = {
  name: "taixiu",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Em bé chỉnh sửa",
  description: "Play tai xiu game with coin bets",
  commandCategory: "game",
  usages: "[tài/xỉu/tai/xiu] [bet amount/all]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Currencies }) {
  const { threadID, messageID, senderID } = event;

  // Get player money
  const userData = await Currencies.getData(senderID);
  const money = userData?.money || 0;

  // Check syntax
  const choiceInput = args[0]?.toLowerCase();
  
  if (!["tài", "xỉu", "tai", "xiu"].includes(choiceInput)) {
    return api.sendMessage(
      "⚠️ Wrong syntax!\nUsage: taixiu [tài/xỉu] [bet amount/all]\nExample: taixiu tài 100",
      threadID,
      messageID
    );
  }

  let choice = (choiceInput === "tai") ? "tài" : (choiceInput === "xiu" ? "xỉu" : choiceInput);
  
  let betInput = args[1]?.toLowerCase();
  let bet;
  if (betInput === "all" || betInput === "allin") {
    bet = money;
  } else {
    if (betInput?.endsWith('k')) {
       bet = parseInt(betInput.slice(0, -1), 10) * 1000;
    } else if (betInput?.endsWith('m')) {
       bet = parseInt(betInput.slice(0, -1), 10) * 1000000;
    } else {
       bet = parseInt(betInput, 10);
    }
  }

  if (isNaN(bet) || bet <= 0) {
    return api.sendMessage(
      "⚠️ Invalid bet amount!\nUsage: taixiu [tài/xỉu] [bet amount/all]\nExample: taixiu tài 100",
      threadID,
      messageID
    );
  }

  if (money < bet) {
    return api.sendMessage(`💸 You don't have enough money. Current balance: ${money} coins`, threadID, messageID);
  }

  // Roll dice
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
  const dice3 = Math.floor(Math.random() * 6) + 1;
  const total = dice1 + dice2 + dice3;
  
  let result = total >= 11 ? "tài" : "xỉu";
  if (dice1 === dice2 && dice2 === dice3) {
    result = "bão";
  }

  // Compare result
  let msg = `🎲 Dice roll result: ${dice1} + ${dice2} + ${dice3} = ${total}\n`;
  msg += `👉 Result: ${result.toUpperCase()}\n`;

  if (choice === result) {
    await Currencies.increaseMoney(senderID, bet);
    msg += `🎉 You win! +${bet} coins`;
  } else {
    await Currencies.decreaseMoney(senderID, bet);
    msg += `💔 You lose! -${bet} coins`;
  }

  const fs = require("fs");
  const path = require("path");
  let attachments = [];
  for (let dice of [dice1, dice2, dice3]) {
    let imgPath = path.join(__dirname, "xúc xắc", `${dice}.jpg`);
    if (!fs.existsSync(imgPath)) {
      imgPath = path.join(__dirname, "xúc xắc", `${dice}.png`);
    }
    if (fs.existsSync(imgPath)) {
      attachments.push(fs.createReadStream(imgPath));
    }
  }

  let sendObj = { body: msg };
  if (attachments.length > 0) {
    sendObj.attachment = attachments;
  }

  return api.sendMessage(sendObj, threadID, messageID);
};
