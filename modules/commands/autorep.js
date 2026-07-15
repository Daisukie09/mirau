let axios = require('axios');
let fs = require('fs');

if (!fs.existsSync(__dirname+'/bot'))fs.mkdirSync(__dirname+'/bot');

let streamURL = (url, type)=>axios.get(url, {
 responseType: 'arraybuffer'
}).then(res=> {
 let path = __dirname+'/bot/'+Date.now()+'.'+type;

 fs.writeFileSync(path, res.data);
 setTimeout(p=>fs.unlinkSync(p), 1000*60, path);

 return fs.createReadStream(path);
});
let data = {};
let path = __dirname+'/bot/autorep.json'
let save = ()=>fs.writeFileSync(path, JSON.stringify(data));
if (!fs.existsSync(path))save(); else data = require(path);

exports.config = {
 name: 'autorep',
 version: '0.0.1',
 hasPermssion: 1,
 credits: 'DC-Nam',
  description: 'Set auto reply for group!',
  commandCategory: 'User',
  usages: '.../question | answer | image/video/gif link',
 cooldowns: 3
};
exports.run = function(o) {
 let input = o.args.join(' ').split('|').filter($=>!!$).map($=>$.trim());
 let tid = o.event.threadID;
 let send = (msg, callback)=>o.api.sendMessage(msg, tid, callback, o.event.messageID);

 let[key, value, url] = input;

  if (o.args[0] == 'del')return send(`=== 『 𝐍𝐠𝐨̣𝐜 𝐇𝐢𝐞̂́𝐮 ✅ 』 ===\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n[🔰] ➜ Reply to this message with the keyword to delete!`, (err, res)=> {
 res.name = exports.config.name,
 res.type = '1',
 res.event = o.event,
 global.client.handleReply.push(res);
 });
  if (!/2|3/.test(input.length))return send(`=== 『 SUPPORT 』 ===\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n[🔰] ➜ Please Enter As Follows: question | answer | image/video/gif link if needed\n\n[❗] ➜ Example:\n${global.config.PREFIX}${this.config.name} Tài | Tài xauzai\n\n${global.config.PREFIX}${this.config.name} Tài | Tài dz | https://i.imgur.com/Et8KShE.jpg\n\n[❎] ➜ ${global.config.PREFIX}${this.config.name} del: to delete installed autorep!`);
  if (typeof url == 'string' && !/^http(s|):\/\//.test(url))return send(`=== 『 𝐍𝐠𝐨̣𝐜 𝐇𝐢𝐞̂́𝐮 ✅ 』 ===\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n[🔰] ➜ Invalid URL`);
 if (!data[tid])data[tid] = {};
 if (!data[tid][key]) {
 data[tid][key] = [{
 text: value,
 url,
 timestamp: Date.now()+25200000,
 }];
  send(`=== 『 𝐍𝐠𝐨̣𝐜 𝐇𝐢𝐞̂́𝐮 ✅ 』 ===\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n[🔰] ➜ Added new auto rep!`);
  } else {
  data[tid][key].push({
  text: value,
  url,
  timestamp: Date.now()+25200000,
  });
  send(`=== 『 𝐍𝐠𝐨̣𝐜 𝐇𝐢𝐞̂́𝐮 ✅ 』 ===\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n[🔰] ➜ Added answer to keyword "${key}"`);
 };
 save();
};
exports.handleEvent = async function(o) {
 let key = o.event.body || '';
 let tid = o.event.threadID;
 let send = (msg, callback)=>o.api.sendMessage(msg, tid, callback, o.event.messageID);

 if (!data[tid])data[tid] = {};
 if (!data[tid][key])return;

 let value = data[tid][key][Math.random()*data[tid][key].length<<0];
 let form_msg = {};
 form_msg.body = value.text;
 if (typeof value.url == 'string') {
 form_msg.attachment = [];
 for (let url of value.url.split(','))try {
 form_msg.attachment.push(await streamURL(url, url.split('.').pop()));
 }catch {
 continue
 };
 };
 send(form_msg);
};
exports.handleReply = function(o) {
 let _ = o.handleReply;
 let key = o.event.body;
 let tid = o.event.threadID;
 let send = (msg, callback)=>o.api.sendMessage(msg, tid, callback, o.event.messageID);

 if (_.event.senderID != o.event.senderID)return;

 switch (_.type) {
 case '1': {
  if (!data[tid][key])return send(`=== 『 AUTOREP  』 ===\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n[🔰] ➜ Auto rep keyword not found in data!`);
  send(`=== 『 AUTOREP  』 ===\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n[🔰] ➜ Keyword "${key}" has ${data[tid][key].length} answers\n\n${data[tid][key].map(($, i)=>`${i+1} » ${$.text}`).join('\n')}\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n[💬] ➜ Reply with the number to delete the corresponding answer or "all"`, (err, res)=> {
 res.name = exports.config.name,
 res.type = '2',
 res.event = o.event,
 global.client.handleReply.push(res);
 });
 };
 break;
 case '2': {
 if (key.toLowerCase() == 'all') {
 delete data[tid][_.event.body];
 } else for(let i = o.event.args.length - 1; i >= 0; i--) {
 let index = o.event.args[i]-1;
 if (isFinite(index) && !!data[tid][_.event.body][index])data[tid][_.event.body].splice(index, 1);
 };
 save();
  send(`=== 『 AUTOREP 』 ===\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n[❎] ➜ Deleted successfully!`); 
 };
 break;
 }
};
