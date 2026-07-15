module.exports.config = {
  name: "busy",
  version: "1.0.0",
  permissions: 3,
  credits: "Henry",
  description: "Enable or disable busy mode",
  usages: "[reason]",
  commandCategory: "Admin",
  cooldowns: 5,
  // List of admin IDs specified in config
  admins: ['100085073240621', 'admin_id_2'] // Replace admin_id_1, admin_id_2 with actual admin IDs
};

const busyPath = __dirname + '/cache/busy.json';
const fs = require('fs');

// Check if sender is admin
function isAdmin(senderID) {
  return module.exports.config.admins.includes(senderID);
}

module.exports.onLoad = () => {
  if (!fs.existsSync(busyPath)) fs.writeFileSync(busyPath, JSON.stringify({}));
};

module.exports.handleEvent = async function({ api, event, Users }) {
  let busyData = JSON.parse(fs.readFileSync(busyPath));
  const { senderID, threadID, messageID, mentions } = event;

  // Check if someone tags a busy person
  if (mentions && Object.keys(mentions).length > 0) {
    for (const [ID, name] of Object.entries(mentions)) {
      if (ID in busyData) {
        var infoBusy = busyData[ID];
        var mentioner = await Users.getNameUser(senderID); // Get name of person who tagged
        var taggedUserName = await Users.getNameUser(ID); // Get name of tagged person (busy person)

        // Send busy reason and name notification to the tagger
        api.sendMessage(`${mentioner},\nwhy did you tag me${infoBusy.lido ? ` - ${infoBusy.lido}` : "?"}`, threadID, async (error, messageInfo) => {
          if (!error) {
            console.log(`Message sent with messageID: ${messageInfo.messageID}`);
            // After 5 seconds, unsend the message
            setTimeout(() => {
              api.unsendMessage(messageInfo.messageID, (err) => {
                if (err) {
                  console.error('Cannot unsend message:', err);
                } else {
                  console.log('Message unsent');
                }
              });
            }, 5000); // 5000 ms = 5s
          } else {
            console.error("Error when sending message:", error);
          }
        });
      }
    }
  }
};

module.exports.run = async function({ api, event, args, Users }) {
  const { threadID, senderID, messageID, body } = event;

  // Check if sender is admin
  if (!isAdmin(senderID)) {
    return api.sendMessage("[𝐁𝐎𝐓 𝐂𝐔𝐓𝐄] - You don't have permission to use this command. Only admin can enable busy mode.", threadID, messageID);
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  let busyData = JSON.parse(fs.readFileSync(busyPath));
  var content = args.join(" ") || "";

  // Enable busy mode for admin
  if (!(senderID in busyData)) {
    busyData[senderID] = {
      lido: content,
      tag: []
    };
    fs.writeFileSync(busyPath, JSON.stringify(busyData, null, 4));
    var msg = (content.length == 0) ? '[𝐁𝐎𝐓 𝐂𝐔𝐓𝐄] - Master has enabled busy mode without reason 🐧' : `[𝐁𝐎𝐓 𝐂𝐔𝐓𝐄] - Master has enabled busy mode with reason 🐧: ${content}`;
    return api.sendMessage(msg, threadID, messageID);
  }
};
