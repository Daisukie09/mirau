const axios = require('axios');

// Groq API Key - TDF-2803
const GROQ_API_KEY = process.env.GROQ_API_KEY;

module.exports.config = {
    name: "autoask",
    eventType: ["message", "message_reply"],
    version: "1.0.0",
    credits: "TDF-2803 | zL: 0878139888",
    description: "Auto AI reply when there is a question mark"
};




module.exports.run = async function ({ }) {
    // Do nothing
};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;
    console.log(`[AUTOASK] Checking: ${body} | Sender: ${senderID}`);

    if (!body || body.trim() === '') return;
    if (senderID === api.getCurrentUserID()) return;

    const message = body.trim();

    // Activate when there is a ? at the end (even with a space)
    if (!/\?\s*$/.test(body) || body.replace(/\s/g, '').length < 2) return;

    // Skip commands (starting with prefix)
    const prefix = global.config.PREFIX || '/';
    if (message.startsWith(prefix)) return;

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            messages: [
                {
                    role: "system",
                    content: "You are TDF-Bot. Reply concisely and naturally in Vietnamese like a friend, add some humorous lines depending on the situation, cheerful and playful style."
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
        // Silent on error
    }
};
