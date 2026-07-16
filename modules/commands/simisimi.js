const axios = require("axios");
const qs = require("querystring");

const LANG_MAP = {
  "vn": ["vietnam", "vietnamese", "tiếng việt"],
  "en": ["english", "eng"],
  "ph": ["philippines", "tagalog", "filipino"],
  "zh": ["chinese", "china", "中文"],
  "ch": ["chinese", "china", "中文"],
  "ru": ["russian", "russia"],
  "id": ["indonesia", "indonesian"],
  "ko": ["korean", "korea"],
  "ar": ["arabic"],
  "fr": ["french"],
  "ja": ["japanese", "japan"],
  "es": ["spanish", "español"],
  "de": ["german", "deutsch"],
};

module.exports.config = {
  name: "simisimi",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Vincent Magtolis",
  description: "Chat with SimSimi AI in multiple languages.",
  commandCategory: "AI Chat",
  usages: "[text] or [lang] [text] — e.g. simisimi en hello / simisimi ph kamusta",
  cooldowns: 3,
  dependencies: {
    "axios": "",
    "querystring": ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  if (args.length === 0) return api.sendMessage("Usage: simisimi [optional: lang code] <text>", threadID, messageID);

  let lc = "en";
  let text = args.join(" ");

  const first = args[0].toLowerCase();
  if (LANG_MAP[first] || Object.values(LANG_MAP).some(list => list.includes(first))) {
    lc = Object.keys(LANG_MAP).find(k => k === first || LANG_MAP[k].includes(first)) || "en";
    text = args.slice(1).join(" ");
    if (!text) return api.sendMessage("Please provide a message after the language code.", threadID, messageID);
  }

  try {
    const res = await axios.post("https://api.simsimi.vn/v1/simtalk",
      qs.stringify({ text, lc, key: "" }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" }, timeout: 15000 }
    );

    const reply = res.data?.message || res.data?.text || "No response.";
    api.sendMessage(reply, threadID, messageID);
  } catch (err) {
    api.sendMessage("SimSimi is busy. Try again later.", threadID, messageID);
  }
};
