module.exports.config = {
    name: 'tách',
    version: '1.1.1',
    hasPermssion: 0,
    Rent: 2,
    credits: 'adu',
    description: 'Remove background',
    commandCategory: 'Utility',
    usages: 'Reply images or url images',
    cooldowns: 2,
    usePrefix: false,
    dependencies: {
         'form-data': '',
         'image-downloader': ''
      }
  };
  
  const axios = require('axios');
  const FormData = require('form-data');
  const fs = require('fs-extra');
  const path = require('path');
  const {image} = require('image-downloader');
  module.exports.run = async function({
      api, event, args
  }){
      try {
        var tpk = `Removed successfully!`;
          if (event.type !== "message_reply") return api.sendMessage({body:"🧬 You must reply to an image",attachment: (await axios.get((await axios.get(`https://marked-bubbly-wildcat.glitch.me/cosplayv2`)).data.url, {
                                     responseType: 'stream'
                                 })).data
                   },  event.threadID, event.messageID);
          if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage({body:"😡 You must reply to an image",attachment: (await axios.get((await axios.get(`https://marked-bubbly-wildcat.glitch.me/vdcosplayv2`)).data.url, {
                                     responseType: 'stream'
                                 })).data
                   },  event.threadID, event.messageID);
          if (event.messageReply.attachments[0].type != "photo") return api.sendMessage("➜ This is not an image", event.threadID, event.messageID);
  
          const content = (event.type == "message_reply") ? event.messageReply.attachments[0].url : args.join(" ");
          const KeyApi = ["VFxMjCGQdECnQUySnYoiBUfv"]
          const inputPath = path.resolve(__dirname, 'cache', `photo.png`);
           await image({
          url: content, dest: inputPath
      });
          const formData = new FormData();
          formData.append('size', 'auto');
          formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
          axios({
              method: 'post',
              url: 'https://api.remove.bg/v1.0/removebg',
              data: formData,
              responseType: 'arraybuffer',
              headers: {
                  ...formData.getHeaders(),
                  'X-Api-Key': KeyApi[Math.floor(Math.random() * KeyApi.length)],
              },
              encoding: null
          })
              .then((response) => {
                  if (response.status != 200) return console.error('Error:', response.status, response.statusText);
                  fs.writeFileSync(inputPath, response.data);
                  return api.sendMessage({body:tpk, attachment: fs.createReadStream(inputPath)},event.threadID, () => fs.unlinkSync(inputPath));
              })
              .catch((error) => {
                  return console.error('Request failed:', error);
              });
       } catch (e) {
          console.log(e)
          return api.sendMessage(`➜ Error, please check the API key!!!`, event.threadID, event.messageID);
    }
  };
