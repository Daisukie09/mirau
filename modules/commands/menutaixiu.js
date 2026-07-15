module.exports.config = {
    name: "menutaixiu",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "TDF-2803",
    description: "Dedicated menu for Tai Xiu game and balance check",
    commandCategory: "Game",
    usages: "",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, Currencies, Users }) {
    const { threadID, messageID, senderID } = event;
    const prefix = (global.data.threadData.get(threadID) || {}).PREFIX || global.config.PREFIX || "/";

    try {
        // Get user name and balance
        let name = await Users.getNameUser(senderID);
        let userData = await Currencies.getData(senderID);
        let money = userData && userData.money ? userData.money : 0;

        let msg = `=== 🎲 TAI XIU & ECONOMY MENU 🎲 ===\n`;
        msg += `👤 Player: ${name}\n`;
        msg += `💰 Current Balance: ${money.toLocaleString('en-US')} $\n`;
        msg += `────────────────────\n`;
        msg += `📋 RELATED COMMANDS:\n`;
        msg += `1. ${prefix}taixiu [tai/xiu] [amount|allin] » Play Tai Xiu\n`;
        msg += `2. ${prefix}bauucua [bau/cua/tom/ca/ga/nai] [amount] » Play Bau Cua\n`;
        msg += `3. ${prefix}lo [number] [money] » Play number lottery\n`;
        msg += `4. ${prefix}money [@tag/reply] » Check your or others' balance\n`;
        msg += `5. ${prefix}setmoney [@tag/reply] [amount] » Add/Edit money (Admin only)\n`;
        msg += `6. ${prefix}pay [@tag/reply] [amount] » Transfer money to others\n`;
        msg += `7. ${prefix}bank » Deposit/Withdraw bank interest\n`;
        msg += `8. ${prefix}work » Work to earn more money\n`;
        msg += `9. ${prefix}daily » Get daily attendance reward\n`;
        msg += `────────────────────\n`;
        msg += `💡 Have fun playing and good luck!`;

        return api.sendMessage(msg, threadID, messageID);
    } catch (e) {
        console.error(e);
        return api.sendMessage("An error occurred while getting your balance info!", threadID, messageID);
    }
};
