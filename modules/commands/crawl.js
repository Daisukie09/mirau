const axios = require('axios');

module.exports.config = {
  name: "crawl",
  version: "1.0.1",
  hasPermission: 2,
  credits: "L.V. Bằng",
  description: "Crawl API",
  commandCategory: "Admin",
  usages: "<url> <số lượng> <type>",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const urlApi = args[0];
  const number = parseInt(args[1]);
  const type = args[2];
  if (!urlApi || !number || !type) {
    api.sendMessage('❎ Please enter correct format: <url> <count> <type>', threadID, messageID);
    return;
  }

  api.sendMessage(`🔄 Starting crawl api: ${urlApi}\n🔢 Count: ${number}\nLoading...`, threadID, messageID);

  let isAvailable = false;
  let dataUrls = [];

  while (!isAvailable) {
    try {
      const response = await axios.get(urlApi);
      if (response.status === 200) {
        if (!response.data[type]) {
          api.sendMessage('🔄 Request blocked, please wait 5 min...', threadID, messageID);
          await new Promise(resolve => setTimeout(resolve, 300000));//300000ms = 5 min
          continue;
        } else {
          isAvailable = true;
        }
      } else {
        api.sendMessage(`📝 Status: ${response.status}`, threadID, messageID);
        return;
      }
    } catch (error) {
      api.sendMessage(`⚠️ Error: ${error.message}. Retrying in 10 minutes...`, threadID, messageID);
      await new Promise(resolve => setTimeout(resolve, 600000));
    }
  }

  for (let i = 0; i < number; i++) {
    try {
      const response = await axios.get(urlApi);
      if (!response.data[type]) {
        api.sendMessage('🔄 Request blocked, please wait 5 min...', threadID, messageID);
        await new Promise(resolve => setTimeout(resolve, 300000));
        continue;
      }
      if (response.status === 404) {
        api.sendMessage('⚠️ API is down (error code 404)', threadID, messageID);
        return;
      }
      if (response.status === 200) {
        const dataUrl = response.data[type];
        if (dataUrl && !dataUrls.includes(dataUrl)) {
          dataUrls.push(dataUrl);
        }
      } else {
        api.sendMessage(`📝 Status: ${response.status}`, threadID, messageID);
      }
    } catch (error) {
      api.sendMessage(`⚠️ Error #${i}: ${error.message}`, threadID, messageID);
    }
  }

  try {
    const result = await axios.post("https://api.mocky.io/api/mock", {
      "status": 200,
      "content": `${JSON.stringify(dataUrls, null, 2)}`,
      "content_type": "application/json",
      "charset": "UTF-8",
      "secret": "AkihikoBot",
      "expiration": "never"
    });

    api.sendMessage(`✏️ Total: ${dataUrls.length}/${number}\n📝 Result: ${result.data.link}`, threadID, messageID);
  } catch (error) {
    api.sendMessage(`⚠️ Error: ${error.message}`, threadID, messageID);
    console.error(`⚠️ An error occurred: ${error}`);
  }
}