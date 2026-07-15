const axios = require("axios");
const fs = require("fs");
const ytdl = require('@distube/ytdl-core');

// Regex to find Spotify and CapCut links
const regexSpotify = /https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+(\?si=[a-zA-Z0-9]+)?/g;
const regexCapCut = /https:\/\/www\.capcut\.com\/t\/[a-zA-Z0-9]+/g;

module.exports = class {
  static config = {
    name: "atdytb",
    version: "1000.0.0",
    hasPermssion: 0,
    credits: "Dgk",
    description: "Download videos from YouTube, Facebook, TikTok, Pinterest, CapCut and audio from SoundCloud",
    commandCategory: "Utility",
    usages: "",
    cooldowns: 5
  }

  static run() {}

  static check_url(url) {
    return /^https:\/\//.test(url);
  }

  static async streamURL(url, type) {
    const path = __dirname + `/cache/${Date.now()}.${type}`;
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(path, res.data);
    setTimeout(() => fs.unlinkSync(path), 1000 * 60);
    return fs.createReadStream(path);
  }

  static convertHMS(value) {
    const sec = parseInt(value, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return (hours !== '00' ? hours + ':' : '') + minutes + ':' + seconds;
  }

  static formatPublishDate(publishDate) {
    const dateObj = new Date(publishDate);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = (hours % 12 || 12).toString().padStart(2, '0');

    return `${day}/${month}/${year} || ${formattedHour}:${minutes}:${seconds} ${ampm}`;
  }

  static async handleEvent(o) {
    const { threadID: t, messageID: m, body: b } = o.event;
    const send = msg => o.api.sendMessage(msg, t, m);
    const head = t => ` AUTODOWN - [ ${t} ]\n──────────────────`;

    // Check CapCut link
    const capCutUrls = b.match(regexCapCut);
    if (capCutUrls) {
      for (const url of capCutUrls) {
        try {
          const response = await axios.get(`http://sv.gamehosting.vn:31217/media?url=${encodeURIComponent(url)}`);
          const data = response.data;

          if (!data.error && data.medias && data.medias.length > 0) {
            const videoMedia = data.medias.find(media => media.type === "video");
            if (videoMedia) {
              send({
                body: `${head('CAPCUT')}\n⩺ Title: ${data.title}\n⩺ Duration: ${data.duration}`,
                attachment: await this.streamURL(videoMedia.url, videoMedia.extension)
              });
            } else {
              console.error("No valid video file found from CapCut.");
            }
          } else {
              console.error("Cannot load data from CapCut.");
          }
        } catch (err) {
          console.error("Error loading content from CapCut:", err);
        }
      }
      return;
    }

    // Regex to find SoundCloud info
    const regex = /Listen to (.+?) by (.+?) on #SoundCloud\s+(https?:\/\/[^\s]+)/;
    const match = b.match(regex);

    if (match) {
      const title = match[1].trim();
      const artist = match[2].trim();
      const url = match[3].trim();

      try {
        const response = await axios.get(`http://sv.gamehosting.vn:31217/media?url=${encodeURIComponent(url)}&client_id=YOUR_CLIENT_ID`);
        const data = response.data;

        if (!data.error && data.medias && data.medias.length > 0) {
          const audioData = data.medias[0]; // Get first media info
          const attachment = await this.streamURL(audioData.url, audioData.extension);

          send({
            body: `${head('SOUNDCLOUD')}\n⩺ Title: ${title}\n⩺ Artist: ${artist}\n⩺ Duration: ${data.duration}\n`,
            attachment: attachment
          });
        } else {
          console.error('No valid data found to download from SoundCloud.');
        }
      } catch (error) {
        console.error('Error downloading audio from SoundCloud:', error);
      }
      return;
    }

    if (this.check_url(b)) {
      // Check YouTube link
      if (/(^https:\/\/)((www)\.)?(youtube|youtu|watch)(PP)*\.(com|be)\//.test(b)) {
        ytdl.getInfo(b).then(async info => {
          let detail = info.videoDetails;
          let format = info.formats.find(f => f.qualityLabel && f.qualityLabel.includes('360p') && f.audioBitrate);

          if (format) {
            const publishDate = this.formatPublishDate(detail.publishDate);
            send({
              body: `${head('YOUTUBE')}\n` +
                    `⩺ Title: ${detail.title}\n` +
                    `⩺ Duration: ${this.convertHMS(Number(detail.lengthSeconds))}\n` +
                    `⩺ Author: ${detail.author.name}\n` +
                    `⩺ Published: ${publishDate}\n` +
                    `⩺ Likes: ${detail.likes || 'N/A'}\n` +
                    `⩺ Comments: ${detail.comments || 'N/A'}\n` +
                    `⩺ Shares: ${detail.shares || 'N/A'}`,
              attachment: await this.streamURL(format.url, 'mp4')
            });
          } else {
            console.error('No suitable format found for YouTube video.');
          }
        }).catch(err => console.error('Error loading YouTube video info:', err));

      // Check Spotify link
      } else if (regexSpotify.test(b)) {
        const spotifyUrls = b.match(regexSpotify);
        for (const url of spotifyUrls) {
          try {
            const response = await axios.get(`http://sv.gamehosting.vn:31217/media?url=${encodeURIComponent(url)}`);
            const data = response.data;

            if (!data.error && data.medias && data.medias.length > 0) {
              const audioMedia = data.medias.find(media => media.type === "audio");
              if (audioMedia) {
                send({
                  body: `${head('SPOTIFY')}\n⩺ Title: ${data.title}\n⩺ Duration: ${data.duration}`,
                  attachment: await this.streamURL(audioMedia.url, audioMedia.extension)
                });
              } else {
                console.error("No valid audio file found from Spotify.");
              }
            } else {
                console.error("Cannot load data from Spotify.");
            }
          } catch (err) {
            console.error("Error loading Spotify content:", err);
          }
        }
        return;

      // Check Facebook link
      } else if (/^https:\/\/(www\.facebook\.com\/(groups|share|stories|posts|reel|r)\/|www\.facebook\.com\/[a-zA-Z0-9]+\/posts\/)/.test(b)) {
        axios.get(`http://sv.gamehosting.vn:31217/media?url=${encodeURIComponent(b)}`)
          .then(async res => {
            const data = res.data;
            if (!data.error && data.medias && data.medias.length > 0) {
              const messageBody = `${head('FACEBOOK')}\n⩺ Title: ${data.title}\n⩺ Source: ${data.source}\n`;
              const attachments = [];

              for (const media of data.medias) {
                const mediaType = media.type;
                const fileExtension = media.extension || (mediaType === 'video' ? 'mp4' : 'jpg');

                const attachmentUrl = await this.streamURL(media.url, fileExtension);
                attachments.push(attachmentUrl);
              }

              send({ body: messageBody, attachment: attachments });
            } else {
              console.error('Cannot load data or no valid data.');
            }
          })
          .catch(err => console.error('Error loading Facebook content:', err));

      // Check Pinterest link
      } else if (/https:\/\/pin\.it\/[a-zA-Z0-9]+/.test(b)) {
        const pinterestUrl = b;
        const apiUrl = `https://pinterestdownloader.io/frontendService/DownloaderService?url=${encodeURIComponent(pinterestUrl)}`;

        axios.get(apiUrl)
          .then(async response => {
            const data = response.data;

            if (data && data.medias && data.medias.length > 0) {
              const message = data.title || 'Pinterest Media';
              const attachments = [];
              let videoFound = false;

              // Iterate through media to find videos
              for (const media of data.medias) {
                if (media.videoAvailable && media.extension === 'mp4') {
                  attachments.push(await this.streamURL(media.url, 'mp4'));
                  videoFound = true;
                  break; // Send the first video found and exit the loop
                }
              }

              if (videoFound) {
                send({ body: `${head('PINTEREST')}\n⩺ Title: ${message}`, attachment: attachments });
              } else {
                // If no video found, check for GIFs and images
                for (const media of data.medias) {
                  if (media.extension === 'gif') {
                    attachments.push(await this.streamURL(media.url, 'gif'));
                    send({ body: `${head('PINTEREST')}\n⩺ Title: ${message}`, attachment: attachments });
                    return; // Send the first GIF found and exit the loop
                  } else if (media.extension === 'jpg' || media.extension === 'png') {
                    attachments.push(await this.streamURL(media.url, media.extension));
                    send({ body: `${head('PINTEREST')}\n⩺ Title: ${message}`, attachment: attachments });
                    return; // Send the first image found and exit the loop
                  }
                }
              }

              if (!videoFound && attachments.length === 0) {
                console.error(`${head('PINTEREST')}\n⩺ No valid content to send.`);
              }
            } else {
              console.error('No Pinterest data found.');
            }
          })
          .catch(err => {
            console.error('Error loading Pinterest content:', err);
          });
      }
    else if (/(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//.test(b)) {
        const json = await this.infoPostTT(b); // Fetch TikTok post details
        let attachment = [];
        let audioAttachment = null;

        // Attempt to fetch audio
        if (json.music_info && json.music_info.play) {
          audioAttachment = await this.streamURL(json.music_info.play, 'mp3'); // Download audio
          send({
            body: `${head('TIKTOK')}\n⩺  Author: ${json.author.nickname}\n⩺  Title: ${json.title}\n\n💿 Audio:`,
            attachment: audioAttachment // Send audio directly
          });
        }

        // Handle images or video after audio
        if (json.images && json.images.length > 0) {
          for (const imageUrl of json.images) {
            attachment.push(await this.streamURL(imageUrl, 'png')); // Download images
          }
        } else if (json.play) {
          attachment.push(await this.streamURL(json.play, 'mp4')); // Download video
        }

        if (attachment.length > 0) {
          send({
            body: `${head('TIKTOK')}\n⩺  Author: ${json.author.nickname}\n⩺ URL: https://www.tiktok.com/@${json.author.unique_id}\n⩺ Title: ${json.title || json.description || 'No title'}\n⩺ Likes: ${json.digg_count}\n⩺ Comments: ${json.comment_count}\n⩺ Shares: ${json.share_count}\n⩺ Downloads: ${json.download_count}`,
            attachment: attachment
          });
        }

        return; // Exit after handling TikTok
      }
    }
  }

  // Function to fetch TikTok post details
  static async infoPostTT(url) {
    return axios({
      method: 'post',
      url: `https://tikwm.com/api/`,
      data: {
        url
      },
      headers: {
        'content-type': 'application/json'
      }
    }).then(res => res.data.data);
  }
}

exports.handleReaction = async function ({ api, event, Threads, handleReaction }) {
  // Removed reaction handling code
};
