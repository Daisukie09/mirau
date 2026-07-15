const axios = require('axios').default;

module.exports.config = {
    name: 'upload',
    version: '1.4.0',
    hasPermission: 2,
    credits: 'Trịnh Đình Phát',
    description: 'Upload image, video or audio to social media sites',
    commandCategory: 'Utility',
    usages: 'reply | imgur | catbox | ibb',
    cooldowns: 5,
};

module.exports.run = async ({ api, event, Currencies, args }) => {
    try {
        const { type, messageReply, threadID, messageID } = event;
        if (type !== 'message_reply' || messageReply.attachments.length === 0)
            return api.sendMessage(
                'You must reply to a video, image or audio file',
                threadID,
                messageID
            );

        let linkUp;
        if (args.length > 0) {
            const option = args[0].toLowerCase();
            switch (option) {
                case 'imgur':
                    // Handle upload to Imgur
                    break;
                case 'catbox':
                    // Handle upload to Catbox
                    break;
                case 'ibb':
                    // Handle upload to ImgBB
                    break;
                default:
                    linkUp = args.join(' ');
            }
        } else {
            linkUp = messageReply.attachments[0]?.url;
        }

        if (!linkUp || linkUp.match(/(http(s?):)([/|.|\w|\s|-])+/g) === null)
            return api.sendMessage(
                'Please reply with or enter an image link',
                event.threadID,
                event.messageID
            );

        const userhash = '91f754bb7a38e06337fbe48d5';

        try {
            const res = await axios.post(
                'https://catbox.moe/user/api.php',
                new URLSearchParams({
                    reqtype: 'urlupload',
                    userhash: userhash,
                    url: linkUp,
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Userhash': userhash,
                    },
                }
            );

            api.sendMessage(
                `=== 『 UPFILE SUCCESS 』 ===\n━━━━━━━━━━━━━━━━\n[🐧] ➜ Here is your file link:\n${res.data}`,
                threadID,
                messageID
            );
        } catch (error) {
            api.sendMessage(
`Error executing function: ${error.message}`,
                threadID,
                messageID
            );
// Handle error if needed
        }
    } catch (error) {
        api.sendMessage(
            `Lỗi khi thực hiện chức năng: ${error.message}`,
            threadID,
            messageID
        );
        // Handle error if needed
    }
};