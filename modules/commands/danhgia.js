const fs = require('fs-extra');
const path = require('path');
const ratingsFilePath = path.resolve(__dirname, 'ratings.json');
const usersFilePath = path.resolve(__dirname, 'users.json');

module.exports.config = {
    name: "danhgia",
    version: "1.0.6",
    hasPermssion: 0,
    credits: "Dũngkon",
    description: "Rate bot quality and check scores.",
    commandCategory: "User",
    usages: "[feedback|check]",
    cooldowns: 5
};

// Read ratings from file
async function getRatings() {
    try {
        const data = await fs.readFile(ratingsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save ratings to file
async function saveRatings(ratings) {
    await fs.writeFile(ratingsFilePath, JSON.stringify(ratings, null, 2));
}

// Read user info from file
async function getUsers() {
    try {
        const data = await fs.readFile(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

// Save user info to file
async function saveUsers(users) {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}

module.exports.run = async function({ api, event, args }) {
    const { threadID, senderID } = event;
    const command = args[0] ? args[0].toLowerCase() : '';
    const ratings = await getRatings();
    const users = await getUsers();

    if (command === 'feedback') {
        if (users[senderID]) {
            return api.sendMessage("❌ You have already rated. You can only rate once.", threadID);
        }

        // Prompt user for star rating and feedback
        return api.sendMessage({
            body: "✨ Rate the bot: Please reply to this message with a star rating from 1 to 10 and leave your feedback (e.g., 5 - This is feedback).",
        }, threadID, (err, info) => {
            if (err) return console.error(err);

            global.client.handleReply.push({
                type: 'danhgia',
                name: this.config.name,
                messageID: info.messageID,
                author: senderID
            });
        });
    }

    if (command === 'check') {
        // Check score and aggregate ratings
        const ratings = await getRatings(); // Ensure latest ratings are fetched
        const totalRatings = ratings.length;
        const totalStars = ratings.reduce((sum, rating) => sum + rating.stars, 0);
        const averageRating = totalRatings > 0 ? totalStars / totalRatings : 0;

        const result = `📊 Total bot quality ratings: ${totalRatings}\n` +
                        `⭐ Total stars: ${totalStars}\n` +
                        `⭐ Average rating: ${averageRating.toFixed(2)}\n` +
                        `Feedback:\n${totalRatings > 0 ? ratings.map(r => `⭐ ${r.stars} Stars - ${r.feedback}`).join('\n') : 'No ratings yet.'}`;

        return api.sendMessage(result, threadID);
    }

    return api.sendMessage("❌ Invalid command. Use `[feedback|check]` to rate or check.", threadID);
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const { body, threadID, senderID, messageID } = event;

    if (senderID !== handleReply.author) return;

    // Parse star rating and feedback from message
    const [stars, ...feedbackParts] = body.split('-').map(part => part.trim());
    const parsedStars = parseInt(stars);
    const feedback = feedbackParts.join('-').trim();

    if (isNaN(parsedStars) || parsedStars < 1 || parsedStars > 10) {
        return api.sendMessage(`❌ Invalid star rating. Please choose a star rating from 1 to 10.`, threadID, messageID);
    }

    // Save rating and feedback
    const ratings = await getRatings(); // Ensure latest ratings are fetched
    ratings.push({ stars: parsedStars, feedback: feedback });
    await saveRatings(ratings);

    // Update user rating info
    const users = await getUsers();
    users[senderID] = true;
    await saveUsers(users);

    return api.sendMessage("✅ Thank you for rating! Your rating has been recorded.", threadID, () => {
        api.deleteMessage(handleReply.messageID);
        api.deleteMessage(messageID);
    });
};
