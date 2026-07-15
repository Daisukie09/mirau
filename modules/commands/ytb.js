module.exports.config = {
  name: 'ytb',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'DungUwU',
  description: 'Play music or video via YouTube link or search keyword',
  commandCategory: 'Utilities',
  usages: 'ytb < keyword/url >',
  cooldowns: 5,
  images: [],
  dependencies: {
      'moment-timezone': '',
      'axios': '',
      'fs-extra': '',
      '@distube/ytdl-core': '',
      'axios': '',
      '@ffmpeg-installer/ffmpeg': '',
      'fluent-ffmpeg': ''
  }
};

const mediaSavePath = __dirname + '/cache/Youtube/';
const key = "AIzaSyAygWrPYHFVzL0zblaZPkRcgIFZkBNAW9g";
module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { threadID, messageID, body, senderID } = event;
  const { author, videoID, IDs, type: reply_type } = handleReply;
  if (senderID != author) return;

  const { createWriteStream, createReadStream, unlinkSync, existsSync, mkdirSync, statSync } = require('fs-extra');
  const moment = require('moment-timezone');
  const currentTime = moment.tz('Asia/Ho_Chi_Minh').format('HH:mm:ss');

  const axios = require('axios');


  const downloadMedia = async (videoID, type) => {
      const filePath = `${mediaSavePath}${Date.now()}${senderID}.${(type == 'video') ? 'mp4' : 'm4a'}`;
      const errObj = {
          filePath,
          error: 1
      };
      try {
          const mediaObj = {
              filePath,
              error: 0
          }

          let ytdlOptions;

          if (!existsSync(mediaSavePath)) mkdirSync(mediaSavePath, { recursive: true });

          if (type == 'video') {
              ytdlOptions = { quality: '18' };
          } else {
              ytdlOptions = { filter: 'audioonly' };
          }
          await new Promise((resolve, reject) => {
              const ytdl = global.nodemodule['@distube/ytdl-core'];
              const ffmpeg = global.nodemodule['fluent-ffmpeg'];
              const startTime = Date.now();
              const stream = ytdl('https://www.youtube.com/watch?v=' + videoID, ytdlOptions)

              if (type == 'video') {
                  stream
                      .pipe(createWriteStream(filePath))
                      .on('error', (err) => {
                          reject(err);
                      })
                      .on('close', () => {
                          resolve()
                      })
              } else {
                  ffmpeg.setFfmpegPath(global.nodemodule['@ffmpeg-installer/ffmpeg'].path);

                  ffmpeg(stream)
                      .audioCodec("aac")
                      // .bitrate(128)
                      .save(filePath)
                      .on("error", err => {
                          reject(err);
                      })
                      .on("end", () => {
                          console.log('☑️ Downloaded, converted in ' + (Date.now() - startTime) + 'ms');
                          resolve();
                      })
              }

          });

          return mediaObj;
      } catch (e) {
          console.log(e)
          return errObj;
      }
  }

  switch (reply_type) {
      case 'download':
          {
              const { filePath, error } = await downloadMedia(videoID, body == '1' ? 'video' : 'audio');

              const mediaData = {
                  title: (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=${key}`)).data.items[0].snippet.title,
                  duration: prettyTime((await axios.get(encodeURI(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoID}&key=${key}`))).data.items[0].contentDetails.duration)
              }

              if (error != 0) {
                  api.sendMessage('❎ An error has occurred', threadID, messageID);
                  if (existsSync(filePath)) unlinkSync(filePath);
              } else {
                  api.unsendMessage(handleReply.messageID);
                  if ((statSync(filePath).size > 50331648 && body == 1) || (statSync(filePath).size > 26214400 && body == 2)) {
                      api.sendMessage('⚠️ Cannot send because file size is too large', threadID, messageID);
                      unlinkSync(filePath);
                  } else {
                      api.sendMessage({
                          body: `[ YOUTUBE DOWNLOAD CONVERT ]\n──────────────────\n📝 Title: ${mediaData.title}\n⏳ Duration: ${mediaData.duration}\n⏰ Time: ${currentTime}`,
                          attachment: createReadStream(filePath)
                      }, threadID, (err) => {
                          if (err) {
                              console.log(err);
                              api.sendMessage('❎ An error has occurred', threadID, messageID);
                          }
                          if (existsSync(filePath)) unlinkSync(filePath);
                      }, messageID);
                  }
              }
              break;
          }
      case 'list':
          {
              if (isNaN(body) || body < 1 || body > IDs.length) {
                  api.sendMessage('⚠️ Please select a number from 1 to ' + IDs.length, threadID, messageID);
              } else {
                  api.unsendMessage(handleReply.messageID);
                  const chosenIndex = parseInt(body) - 1;
                  const chosenID = IDs[chosenIndex];
    api.sendMessage('[ YOUTUBE SELECT ]\n──────────────────\n1. Download video\n2. Download audio\n\n📌 Reply with the number to proceed', threadID,
        (error, info) => {
                          if (error) {
                              console.log(error);
                              api.sendMessage('❎ Error while processing request', threadID, messageID);
                          } else {
                              global.client.handleReply.push({
                                  type: 'download',
                                  name: this.config.name,
                                  messageID: info.messageID,
                                  author: senderID,
                                  videoID: chosenID
                              })
                          }
                      },
                      messageID);
              }

          }
  }
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  if (args.length == 0) return api.sendMessage('❎ Search field cannot be empty', threadID, messageID);
  const input = args.join(' ');
  const urlPatten = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm;
  const isValidUrl = urlPatten.test(input);

  const axios = global.nodemodule['axios'];

  const getBasicInfo = async (keyword) => {
      try {
          const mediaData = (await axios.get(encodeURI(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${keyword}&type=video&key=${key}`))).data.items;
          return mediaData;
      } catch (e) {
          throw e;
      }
  }

  try {
      if (isValidUrl) {
          let videoID = input.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
          (videoID[2] !== undefined) ? videoID = videoID[2].split(/[^0-9a-z_\-]/i)[0] : videoID = videoID[0];

api.sendMessage(`[ YOUTUBE SELECT ]\n──────────────────\n1. Download video\n2. Download audio\n\n📌 Reply with the number to proceed`, threadID, (error, info) => {
                  if (error) {
                      console.log(error);
                  } else {
                      global.client.handleReply.push({
                          type: 'download',
                          name: this.config.name,
                          messageID: info.messageID,
                          author: senderID,
                          videoID
                      })
                  }
              },
              messageID);
      } else {
          let IDs = [],
              msg = '',
              result = await getBasicInfo(input);

          for (let i = 0; i < result.length; i++) {
              const id = result[i].id.videoId;
              if (id !== undefined) {
                  IDs.push(id);
                  const mediaDuration = (await axios.get(encodeURI(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${id}&key=${key}`))).data.items[0].contentDetails.duration;
                  msg += `\n──────────────────\n${i + 1}. ${result[i].snippet.title}\n⏳ Duration: ${prettyTime(mediaDuration)}`;
              }
          }

          msg = `[ YOUTUBE SEARCH ]\n──────────────────\n📝 Found ${IDs.length} results matching your search keyword:${msg}\n──────────────────\n\n📌 Reply with the number of the video you want to download`
 api.sendMessage(msg, threadID, (error, info) => {
              if (error) {
                  console.log(error);
              } else {
                  global.client.handleReply.push({
                      type: 'list',
                      name: this.config.name,
                      messageID: info.messageID,
                      author: event.senderID,
                      IDs
                  })
              }
     }, event.messageID);
      }
  } catch (e) {
      api.sendMessage('❎ An error has occurred:\n' + e, threadID, messageID);
  }
  return;
}

const prettyTime = (time) => {
  let newTimeArray = [];
  time = time.slice(2);

  if (time.includes('H')) {
      newTimeArray.push(time.split('H')[0]);
      time = time.split('H')[1];
  } else newTimeArray.push(0);
  if (time.includes('M')) {
      newTimeArray.push(time.split('M')[0]);
      time = time.split('M')[1];
  } else newTimeArray.push(0);
  if (time.includes('S')) {
      newTimeArray.push(time.split('S')[0]);
  } else newTimeArray.push(0);

  newTimeArray = newTimeArray.map(item => {
      if (parseInt(item) < 10) {
          return '0' + item;
      } else return item;
  })
  return newTimeArray.join(':');
}