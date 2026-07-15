const fs = require('fs');
const axios = require('axios');
const path = require('path');

module.exports.config = {
    name: "loppy",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Hung dep trai Convert By Dũngkon",
    description: "Toggle loppy-style message mimic feature",
    commandCategory: "User",
    usages: "!loppy",
    cooldowns: 5,
};

let Loppy = [];
let alreadyProcessed = {};  // Save event processing state

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;

    const find = Loppy.find(item => item == threadID);
    if (!find) {
        Loppy.push(threadID);
        return api.sendMessage('Loopy-style mimic activated!', threadID, messageID);
    } else {
        Loppy = Loppy.filter(item => item != threadID);
        return api.sendMessage('Loopy-style mimic deactivated!', threadID, messageID);
    }
};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, body, senderID } = event;
    if (!body) return;

    const check = Loppy.find(item => item == threadID);
    if (!check) return;

    // Check if sender is bot then don't reply
    // if (senderID === api.getCurrentUserID()) return; // Removed so bot can reply to its own messages

    // Check if event has been processed
    if (alreadyProcessed[messageID]) return;

    const processedMessage = processSentence(body);

    const imageLinks = [
        "https://i.imgur.com/PqnesFX.jpeg",
        "https://i.imgur.com/vqK3olK.jpeg",
        "https://i.imgur.com/xlXHyFi.jpeg",
        "https://i.imgur.com/YsSDaiR.jpeg"
    ];
    const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    const imagePath = path.join(__dirname, 'temp_image.jpg');

    // Download and save the image temporarily
    await downloadImage(randomImage, imagePath);

    api.sendMessage({
        body: processedMessage,
        attachment: fs.createReadStream(imagePath)
    }, threadID, (error) => {
        if (!error) {
            // Delete the image after sending
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }
    }, messageID);

    // Mark this event as processed
    alreadyProcessed[messageID] = true;

    // Clear state after a short time to avoid memory overflow
    setTimeout(() => {
        delete alreadyProcessed[messageID];
    }, 30000); // 30 seconds
};

function replaceWordWithNh(word) {
    const vowels = 'aeiouăâêôơưáắấéếíóốớúứýàằầèềìòồờùừỳảẳẩẻểỉỏổởủửỷãẵẫẽễĩõỗỡũữỹạặậẹệịọộợụựỵ';
    word = word.toLowerCase();

    if (word == 'ok') return 'nhô nhê';
    if (word == 'cc' || word == 'vl') return 'nhờ nhờ';
    if (word == 'hihi') return 'nhi nhi';
    if (word == 'haha') return 'nha nha';
    if (word == 'hoho') return 'nho nho';
    if (word == 'paipai') return 'nhai nhai';
    if (word == 'kaka') return 'nha nha';
    if (word == 'dume') return 'nhu nhe';
    if (word == 'duma') return 'nhu nha';
    if (word == 'adu') return 'nha nhu';
    if (word == 'loppy') return 'nhop nhy';

    const index = word.split('').findIndex(char => vowels.includes(char));

    if (index !== -1) {
        return 'nh' + word.slice(index);
    }
    return word;
}

function processSentence(sentence) {
    const words = sentence.split(/\s+/);
    const processedWords = words.map(replaceWordWithNh);
    return processedWords.join(' ');
}

// Function to download image from URL
async function downloadImage(url, filePath) {
    const response = await axios({
        url,
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}