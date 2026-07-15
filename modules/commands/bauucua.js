module.exports.config = {
  name: "baucua",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Fix by em bé của anh bé",
  description: "Gourd-Crab-Shrimp-Fish game with betting",
  commandCategory: "Game",
  usages: "<gourd/crab/shrimp/fish/rooster/deer> <amount>",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Currencies }) {
  const { threadID, messageID, senderID } = event;
  const list = ["gourd", "crab", "shrimp", "fish", "rooster", "deer"];

  if (args.length < 2)
    return api.sendMessage("💬 Usage: baucua <choose> <amount>\n📌 Example: baucua fish 500", threadID, messageID);

  const choose = args[0].toLowerCase();
  const moneyBet = parseInt(args[1]);

  if (!list.includes(choose))
    return api.sendMessage("❌ You can only choose: gourd, crab, shrimp, fish, rooster, deer!", threadID, messageID);

  if (isNaN(moneyBet) || moneyBet <= 0)
    return api.sendMessage("❌ Invalid bet amount.", threadID, messageID);

  const userMoney = (await Currencies.getData(senderID)).money;
  if (moneyBet > userMoney)
    return api.sendMessage("❌ You don't have enough money to bet!", threadID, messageID);

  // Roll 3 random items
  const result = [];
  for (let i = 0; i < 3; i++) {
    result.push(list[Math.floor(Math.random() * list.length)]);
  }

  // Count matches with the chosen item
  const count = result.filter(item => item === choose).length;

  let text = `🎲 Result: ${result.join(" | ")}\n`;
  if (count === 0) {
    await Currencies.decreaseMoney(senderID, moneyBet);
    text += `😢 You didn't hit any.\n💸 Lost ${moneyBet}$.`;
  } else {
    const reward = moneyBet * count;
    await Currencies.increaseMoney(senderID, reward);
    text += `🎉 You hit ${count} times "${choose}".\n💰 Received ${reward}$.`;
  }

  return api.sendMessage(text, threadID, messageID);
};
