const axios = require('axios');

// Groq API Key - TDF-2803
const GROQ_API_KEY = process.env.GROQ_API_KEY;

module.exports.config = {
    name: "autoask",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "TDF-2803 | zL: 0878139888",
    description: "Auto reply with AI when there's a ? mark",
    commandCategory: "Utilities",
    usages: "Auto reply when question ends with ?",
    cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;
    // console.log(`[AUTOASK] Checking: ${body}`);

    if (!body || body.trim() === '') return;
    if (senderID === api.getCurrentUserID()) return;

    const message = body.trim();

    // Activate when there's a ? at the end (including with space ' ?') and length > 1
    // Regex: tìm dấu ? ở cuối, có thể có khoảng trắng
    if (!/\?\s*$/.test(body) || body.replace(/\s/g, '').length < 2) return;

    // Bỏ qua nếu bắt đầu bằng prefix (để nó không chạy trùng với lệnh /ask)
    const prefix = global.config.PREFIX || '/';
    if (message.startsWith(prefix)) return;

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            messages: [
                {
                    role: "system",
                    content: "You are TDF-Bot. Reply briefly, naturally in Vietnamese like a friend, add some humor depending on the situation, cheerful and playful style."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        const answer = response.data.choices[0]?.message?.content;

        if (answer) {
            return api.sendMessage(answer, threadID, messageID);
        }

    } catch (error) {
        // Im lặng khi lỗi
    }
};

module.exports.run = async function ({ api, event, args }) {
    // Command này không cần chạy trực tiếp, nó chạy qua handleEvent
    return api.sendMessage("Auto question reply feature (?) is running in the background!", event.threadID, event.messageID);
};
