const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
    config: {
        name: "ảnh",
        version: "1.0.3",
        hasPermssion: 0,
        credits: "Trịnh Đình Phát",
        description: "View images/videos on demand!",
        usages: "phản hồi 1/2/3",
        commandCategory: "Users",
        cooldowns: 5,
        images: [],
        dependencies: {
            axios: ""
        }
    },
    run: async function ({ event, api, args }) {
        if (!args[0])
            return api.sendMessage(`[ Bot Image & Video Gallery ]\n────────────────\n|› 1. Girls\n|› 2. Boys\n|› 3. Anime\n|› 4. Cosplay\n|› 5. Butt\n|› 6. Boobs\n|› 7. Anime Video\n|› 8. Girls Video\n|› 9. Cosplay Video\n|› 10. Chill Video \n|› 11. Meme \n────────────────\n|› 📌 Reply with the number to view\n|› 💵 Fee per image is 500$`, event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "create"
                });
            }, event.messageID);
    },
    handleReply: async function ({ api, event, client, handleReply, Currencies, Users }) {
        api.unsendMessage(handleReply.messageID);
        await new Promise(resolve => setTimeout(resolve, 1000));
        let name = await Users.getNameUser(event.senderID);
        const $ = 500;
        const money = (await Currencies.getData(event.senderID)).money;
        if (money < $)
            return api.sendMessage(`❎ ${name} needs ${$}$ to view`, event.threadID, event.messageID);

        Currencies.decreaseMoney(event.senderID, $);
        const { p, link } = linkanh(event);

        if (handleReply.type === "create") {
            try {
                const res = await p.get(link, { responseType: "stream" });
                const message = {
                    body: `✅ ${name} has been deducted ${$}$`,
                    attachment: res.data,
                    mentions: [{
                        tag: name,
                        id: event.senderID
                    }]
                };
                api.sendMessage(message, event.threadID, event.messageID);
            } catch (error) {
                console.error("Error sending image:", error);
                return api.sendMessage("❎ An error occurred while processing", event.threadID, event.messageID);
            }
        }
    }
};

function linkanh(event) {
    const filepath = path.join(__dirname, "../../includes", "datajson");
    let h;
    switch (event.body) {
        case "1":
            h = path.join(filepath, "gai.json");
            break;
        case "2":
            h = path.join(filepath, "trai.json");
            break;
        case "3":
            h = path.join(filepath, "anime1.json");
            break;
        case "4":
            h = path.join(filepath, "cosplay.json");
            break;
        case "5":
            h = path.join(filepath, "mong.json");
            break;
        case "6":
            h = path.join(filepath, "du.json");
            break;
        case "7":
            h = path.join(filepath, "vdanime.json");
            break;
        case "8":
            h = path.join(filepath, "vdgai.json");
            break;
        case "9":
            h = path.join(filepath, "vdcos.json");
            break;
        case "10":
            h = path.join(filepath, "vdchill.json");
            break;
        default:
            break;
        case "11":
            h = path.join(filepath, "meme.json");
            break;
    }

    const links = JSON.parse(fs.readFileSync(h));
    const randomIndex = Math.floor(Math.random() * links.length);
    const link = links[randomIndex];
    return { p: axios, link };
}
