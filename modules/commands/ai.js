const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

module.exports.config = {
  name: "ask",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "TDF-2803",
  description: "Chat with AI Groq",
  commandCategory: "User",
  usages: "[question]",
  cooldowns: 3,
  usePrefix: true,
};

async function chat(prompt) {
  try {
    const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
      messages: [
        { role: "system", content: "You are TDF-Bot. Reply briefly in Vietnamese." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024
    }, {
      headers: {
        "Authorization": "Bearer " + GROQ_API_KEY,
        "Content-Type": "application/json"
      },
      timeout: 30000
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Groq Error:", error.message);
    throw error;
  }
}

module.exports.run = async function ({ api, event, args }) {
  try {
    var query = args.join(" ");
    if (event.type === "message_reply" && event.messageReply) {
      query = query + " " + event.messageReply.body;
    }

    if (!query || query.trim() === "") {
      return api.sendMessage("What do you want to ask?", event.threadID, event.messageID);
    }

    var result = await chat(query);

    // Reply directly to the user's message
    return api.sendMessage(result, event.threadID, event.messageID);

  } catch (error) {
    return api.sendMessage("Error, try again later!", event.threadID, event.messageID);
  }
};