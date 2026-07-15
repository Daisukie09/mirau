const axios = require('axios');
const fs = require('fs');
const { join } = require("path");

module.exports.config = {
    name: "adc",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "Thjhn",
    description: "adc all types of raw",
    commandCategory: "Admin",
    usages: "[reply or text]",
    usePrefix: false,
    cooldowns: 0,
    dependencies: {
        "cheerio": "",
        "request": ""
    }
};

module.exports.run = async function ({ api, event, args, Users }) {
    const { senderID, threadID, messageID, messageReply, type } = event;
    var name = args[0];
    if (type == "message_reply") {
        var text = messageReply.body;
    }

    if (!text && !name) return api.sendMessage('❎ Please reply with the link to apply code or enter file name to upload code to runmocky!', threadID, messageID);

    if (!text && name) {
        var data = fs.readFile(
            `${__dirname}/${args[0]}.js`,
            "utf-8",
            async (err, data) => {
                if (err) return api.sendMessage(`❎ Command ${args[0]} does not exist`, threadID, messageID);

              
                async function createMockAPI(name) {
                    try {
                        const response = await axios.post("https://api.mocky.io/api/mock", {
                            status: 200,
                            content: data,
                            content_type: "application/json",
                            charset: "UTF-8",
                            secret: "HungCTer",
                            expiration: "never"
                        });

                        const link = response.data.link;
                        return `${link}`;
                    } catch (error) {
                        throw new Error(`⚠️ Error creating mock API on runmocky: ${error.message}`);
                    }
                }

             
                try {
                    var message = await createMockAPI(args[1] || 'noname');
                    return api.sendMessage(message, threadID, messageID);
                } catch (error) {
                    return api.sendMessage(error.message, threadID, messageID);
                }
            }
        );
        return;
    }

    const urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const url = text.match(urlR);

    if (url) {
        axios.get(url[0]).then(i => {
            var data = i.data;
            fs.writeFile(
                `${__dirname}/${args[0]}.js`,
                data,
                "utf-8",
                function (err) {
                    if (err) return api.sendMessage(`⚠️ An error occurred while applying code to ${args[0]}.js`, threadID, messageID);
                    api.sendMessage(`✅ Successfully applied code to ${args[0]}.js`, threadID, messageID);
                }
            );
        });
    }
};
