module.exports.config = {
  name: "ghép",
  version: "1.0.0", 
  hasPermssion: 0,
  credits: "Hải harin",
  description: "Pair matching",
  commandCategory: "Users", 
  usages: "ghép", 
  usePrefix:true,
  cooldowns: 10
};
module.exports.onLoad = async() => {
    const { resolve } = require("path");
    const { existsSync, mkdirSync } = require("fs-extra");
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const path = resolve(__dirname, 'cache/canvas', 'pairing.png');
    if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.postimg.cc/X7R3CLmb/267378493-3075346446127866-4722502659615516429-n.png", path);
}
module.exports.circle = async (image) => {
  const jimp = require("jimp");
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function({ api, event,Threads, Users, Currencies, args }) {
        const axios = require("axios");
        const fs = require("fs-extra");
     const moment = require("moment-timezone");
var hm = ["https://i.imgur.com/41FJd4m.jpg",
"https://i.imgur.com/uHAsXg2.jpg",
"https://i.imgur.com/ycCfkMS.jpg",
"https://i.imgur.com/q064dsF.jpg",
"https://i.imgur.com/XuAl9rP.jpg",
"https://i.imgur.com/4FOsdRA.jpg",
"https://i.imgur.com/G5rA8K9.jpg"]
  var hmm = hm[Math.floor(Math.random() * hm.length)]
    var timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss")
const { threadID, senderID, messageID, type, mentions, body } = event,{ PREFIX } = global.config;
  let threadSetting = global.data.threadData.get(threadID) || {};
let prefix = threadSetting.PREFIX || PREFIX;

   if (args.length == 0) return api.sendMessage({body:`=== [ 𝗣𝗔𝗜𝗥𝗜𝗡𝗚 𝗦𝗘𝗥𝗩𝗘𝗥 ] ===
━━━━━━━━━━━━━━━
💙 ${prefix}𝗴𝗵𝗲́𝗽𝘃𝟮 𝗶𝗳 𝘆𝗼𝘂 𝘄𝗮𝗻𝘁 𝘁𝗵𝗲 𝘁𝗶𝗻𝗱𝗲𝗿-𝘀𝘁𝘆𝗹𝗲 𝗽𝗮𝗶𝗿𝗶𝗻𝗴
❤️ ${prefix}𝗴𝗵𝗲́𝗽 + 𝘀𝘃 𝗯𝗼𝘁 𝘄𝗶𝗹𝗹 𝗳𝗶𝗻𝗱 𝗽𝗲𝗼𝗽𝗹𝗲 𝗼𝗻 𝘁𝗵𝗲 𝘀𝗲𝗿𝘃𝗲𝗿
💛 ${prefix}𝗴𝗵𝗲́𝗽 + 𝗰𝗮𝗻𝘃𝗮𝘀 𝗽𝗮𝗶𝗿 𝗮𝘀 𝗰𝗮𝗻𝘃𝗮𝘀 𝗶𝗺𝗮𝗴𝗲
🖤 ${prefix}𝗚𝗵𝗲́𝗽 + 𝗰𝗮𝗻𝘃𝗮𝘀𝟮 𝗽𝗮𝗶𝗿 𝗮𝘀 𝗰𝗮𝗻𝘃𝗮𝘀 𝗶𝗺𝗮𝗴𝗲
💚 ${prefix}𝗚𝗵𝗲́𝗽 + 𝘀𝗲𝘁𝗯𝗱 𝗽𝗮𝗶𝗿 𝘄𝗶𝘁𝗵 𝗻𝗶𝗰𝗸𝗻𝗮𝗺𝗲 𝘀𝗲𝘁
💜 ${prefix}𝗴𝗵𝗲́𝗽 + 𝗴𝗶𝗳 𝗽𝗮𝗶𝗿 𝘄𝗶𝘁𝗵 𝗮 𝗰𝘂𝘁𝗲 𝗴𝗶𝗳 𝗶𝗻 𝘁𝗵𝗲 𝗺𝗶𝗱𝗱𝗹𝗲

⚠️ 𝗡𝗼𝘁𝗲: 𝗨𝘀𝗲 𝗮𝘀 𝗮𝗯𝗼𝘃𝗲 𝘁𝗼 𝘂𝘀𝗲, 𝘄𝗿𝗶𝘁𝗲 𝗰𝗼𝗿𝗿𝗲𝗰𝘁 𝘀𝗽𝗲𝗹𝗹𝗶𝗻𝗴 𝘁𝗼 𝘄𝗼𝗿𝗸`, attachment: (await axios.get(`${hmm}`, {
                    responseType: 'stream'
                })).data}, event.threadID, event.messageID);
  if (args[0] == "gif") {
const res = await axios.get(`https://lechi.click/text/thinh`);
var love = res.data.data;
  var gio = moment.tz("Asia/Ho_Chi_Minh").format("D/MM/YYYY || HH:mm:ss");
    var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
     if (thu == 'Sunday') thu = '𝗦𝘂𝗻𝗱𝗮𝘆'
  if (thu == 'Monday') thu = '𝗠𝗼𝗻𝗱𝗮𝘆'
  if (thu == 'Tuesday') thu = '𝗧𝘂𝗲𝘀𝗱𝗮𝘆'
  if (thu == 'Wednesday') thu = '𝗪𝗲𝗱𝗻𝗲𝘀𝗱𝗮𝘆'
  if (thu == "Thursday") thu = '𝗧𝗵𝘂𝗿𝘀𝗱𝗮𝘆'
  if (thu == 'Friday') thu = '𝗙𝗿𝗶𝗱𝗮𝘆'
  if (thu == 'Saturday') thu = '𝗦𝗮𝘁𝘂𝗿𝗱𝗮𝘆'
        var { participantIDs } =(await Threads.getData(event.threadID)).threadInfo;
        var tle = Math.floor(Math.random() * 101);
        var namee = (await Users.getData(event.senderID)).name
        const botID = api.getCurrentUserID();
        const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
        var id = listUserID[Math.floor(Math.random() * listUserID.length)];
        var name = (await Users.getData(id)).name
        var arraytag = [];
        const gifCute = ["https://i.pinimg.com/originals/42/9a/89/429a890a39e70d522d52c7e52bce8535.gif","https://i.imgur.com/HvPID5q.gif","https://i.pinimg.com/originals/9c/94/78/9c9478bb26b2160733ce0c10a0e10d10.gif","https://i.pinimg.com/originals/9d/0d/38/9d0d38c79b9fcf05f3ed71697039d27a.gif","https://i.imgur.com/BWji8Em.gif"];
                arraytag.push({id: event.senderID, tag: namee});
                arraytag.push({id: id, tag: name});

  
        let Avatar = (await axios.get( `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" } )).data; 
            fs.writeFileSync( __dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8") );

        let gifLove = (await axios.get(gifCute[Math.floor(Math.random() * gifCute.length)], { responseType: "arraybuffer" } )).data; 
            fs.writeFileSync( __dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8") );

        let Avatar2 = (await axios.get( `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" } )).data;
            fs.writeFileSync( __dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8") );

        var imglove = [];
              
              imglove.push(fs.createReadStream(__dirname + "/cache/avt.png"));
              imglove.push(fs.createReadStream(__dirname + "/cache/giflove.png"));
              imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));

        var msg = {body: `💓=== [ 𝗟𝗼𝘃𝗲 𝗖𝗼𝘂𝗽𝗹𝗲 ] ===💓\n━━━━━━━━━━━━\n😽 𝗣𝗮𝗶𝗿𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆\n[❤️] → 𝗬𝗼𝘂𝗿 𝗡𝗮𝗺𝗲: ${namee}\n[🤍] → 𝗧𝗵𝗲𝗶𝗿 𝗡𝗮𝗺𝗲: ${name}\n[🎀] → 𝗖𝗼𝗺𝗽𝗮𝘁𝗶𝗯𝗶𝗹𝗶𝘁𝘆:${tle}%\n[⏰] → 𝗣𝗮𝗶𝗿𝗲𝗱 𝗮𝘁: [ ${thu} | ${gio} ]\n━━━━━━━━━━━━\n[💌] → 𝗟𝗼𝘃𝗲 𝗟𝗶𝗻𝗲: ${love}`, mentions: arraytag, attachment: imglove}
        return api.sendMessage(msg, event.threadID, event.messageID);
  }

  //else if (args[0] == "card") {
  //function _0x526d(){const _0x2ac4a6=['/tad/UTMFacebookK&TItali.ttf','4731072wRVmgs','Thursday','length','Tuesday','9167529TwXJHU','\x0a━━━━━━━━━━━━\x0a[💌]\x20→\x20𝗧𝗵𝗶́𝗻𝗵:\x20','floor','writeFileSync','3faBVjZ','TáoTpk','pidusage','getContext','width','utf-8','threadID','/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662','Asia/Ho_Chi_Minh','name','\x20||\x20','𝗧𝗵𝘂̛́\x20𝗕𝗮̉𝘆','dddd','circle','9712CuRdnO','unlinkSync','textAlign','𝗧𝗵𝘂̛́\x20𝗧𝘂̛','Monday','\x0a[🎀]\x20→\x20𝗧𝗶̉\x20𝗟𝗲̣̂\x20𝗛𝗼̛̣𝗽\x20Đ𝗼̂𝗶\x20𝗟𝗮̀:','ghep','removeSync','1.0.0','read','6578703mCXrpR','pid','get','random','869380mBNgvK','exports','drawImage','image/png','7403442xtMckz','23px\x20UTM','💓===\x20[\x20𝗟𝗼𝘃𝗲\x20𝗖𝗼𝘂𝗽𝗹𝗲\x20]\x20===💓\x0a━━━━━━━━━━━━\x0a😽\x20𝗚𝗵𝗲́𝗽\x20Đ𝗼̂𝗶\x20𝗧𝗵𝗮̀𝗻𝗵\x20𝗖𝗼̂𝗻𝗴\x0a[❤️]\x20→\x20𝗧𝗲̂𝗻\x20𝗰𝘂̉𝗮\x20𝗯𝗮̣𝗻:\x20','data','axios','run','getCurrentUserID','from','https://drive.google.com/u/0/uc?id=1lh3U5emvpL4wJvxW_M8LFORc4rargy1s&export=download','font','nodemodule','#00000','/noprefix/mdl.jpg','arraybuffer','3460tgxPDx','3370704MNknyl','config','𝗖𝗵𝘂̉\x20𝗡𝗵𝗮̣̂𝘁','jimp','ghép','request','filter','senderID','Saturday','fillStyle','getBufferAsync','%\x0a[⏰]\x20→\x20𝗚𝗵𝗲́𝗽\x20đ𝗼̂𝗶\x20𝘃𝗮̀𝗼\x20𝗹𝘂́𝗰:\x20','toBuffer','https://imgur.com/c7Eppap.png','https://graph.facebook.com/','existsSync','𝗧𝗵𝘂̛́\x20𝗦𝗮́𝘂','format','height','\x0a[🤍]\x20→\x20𝗧𝗲̂𝗻\x20𝗰𝘂̉𝗮\x20𝗻𝗴𝘂̛𝗼̛̀𝗶\x20𝗮̂́𝘆:\x20','getData','fs-extra','Friday','𝗧𝗵𝘂̛́\x20𝗛𝗮𝗶','canvas','𝗧𝗵𝘂̛́\x20𝗡𝗮̆𝗺'];_0x526d=function(){return _0x2ac4a6;};return _0x526d();}const _0x4c370f=_0x16c8;function _0x16c8(_0x2bda46,_0x336beb){const _0x526dba=_0x526d();return _0x16c8=function(_0x16c806,_0x1ae13b){_0x16c806=_0x16c806-0x89;let _0x57d230=_0x526dba[_0x16c806];return _0x57d230;},_0x16c8(_0x2bda46,_0x336beb);}(function(_0x37481d,_0x29b3b0){const _0x20555d=_0x16c8,_0x201c93=_0x37481d();while(!![]){try{const _0x1ad559=parseInt(_0x20555d(0xa9))/0x1*(parseInt(_0x20555d(0xc5))/0x2)+parseInt(_0x20555d(0xa1))/0x3+parseInt(_0x20555d(0xb7))/0x4*(parseInt(_0x20555d(0xd7))/0x5)+-parseInt(_0x20555d(0xc9))/0x6+-parseInt(_0x20555d(0xa5))/0x7+-parseInt(_0x20555d(0xd8))/0x8+-parseInt(_0x20555d(0xc1))/0x9;if(_0x1ad559===_0x29b3b0)break;else _0x201c93['push'](_0x201c93['shift']());}catch(_0x5d9b61){_0x201c93['push'](_0x201c93['shift']());}}}(_0x526d,0xd3483),module[_0x4c370f(0xc6)][_0x4c370f(0xd9)]={'name':_0x4c370f(0xbd),'version':_0x4c370f(0xbf),'hasPermssion':0x0,'credits':_0x4c370f(0xaa),'description':'Ghép\x20đôi','commandCategory':'Game','usages':_0x4c370f(0x8a),'cooldowns':0x2},module[_0x4c370f(0xc6)][_0x4c370f(0xb6)]=async _0x39d2da=>{const _0x4815ca=_0x4c370f,_0x4c4e68=global[_0x4815ca(0xd3)][_0x4815ca(0x89)];return _0x39d2da=await _0x4c4e68[_0x4815ca(0xc0)](_0x39d2da),_0x39d2da[_0x4815ca(0xb6)](),await _0x39d2da[_0x4815ca(0x90)](_0x4815ca(0xc8));},module['exports'][_0x4c370f(0xce)]=async function({api:_0x50e62e,event:_0x185009,Threads:_0x7f49f2,Users:_0x13a44b}){const _0x379894=_0x4c370f,{createReadStream:_0x5db924,existsSync:_0x1e9b9b,mkdirSync:_0x4c2857}=global[_0x379894(0xd3)]['fs-extra'],{loadImage:_0x3f774e,createCanvas:_0x24e1c3,registerFont:_0x435efa}=require(_0x379894(0x9e)),_0x346cb3=global['nodemodule'][_0x379894(0x9b)],_0x4ca09c=global[_0x379894(0xd3)][_0x379894(0xcd)],_0x4015b1=require(_0x379894(0x8b)),_0x2f1d19=await _0x4ca09c[_0x379894(0xc3)]('https://jrt-api.nguyenhaidang.ml/love');var _0x5127a6=_0x2f1d19[_0x379894(0xcc)][_0x379894(0xcc)];const _0x46d8b2=await global[_0x379894(0xd3)][_0x379894(0xab)](process[_0x379894(0xc2)]),_0x1e764c=require('moment-timezone');var _0x596791=_0x1e764c['tz'](_0x379894(0xb1))[_0x379894(0x97)]('D/MM/YYYY\x20||\x20HH:mm:ss'),_0x242edf=_0x1e764c['tz'](_0x379894(0xb1))[_0x379894(0x97)](_0x379894(0xb5));if(_0x242edf=='Sunday')_0x242edf=_0x379894(0xda);if(_0x242edf==_0x379894(0xbb))_0x242edf=_0x379894(0x9d);if(_0x242edf==_0x379894(0xa4))_0x242edf='𝗧𝗵𝘂̛́\x20𝗕𝗮';if(_0x242edf=='Wednesday')_0x242edf=_0x379894(0xba);if(_0x242edf==_0x379894(0xa2))_0x242edf=_0x379894(0x9f);if(_0x242edf==_0x379894(0x9c))_0x242edf=_0x379894(0x96);if(_0x242edf==_0x379894(0x8e))_0x242edf=_0x379894(0xb4);let _0x408e12=__dirname+_0x379894(0xd5),_0x5dc42b=__dirname+'/cache/Av7.png',_0x40511c=__dirname+'/cache/7.png';var _0xaca2ef=_0x185009[_0x379894(0x8d)],{participantIDs:_0x2c904e}=(await _0x7f49f2['getData'](_0x185009[_0x379894(0xaf)]))['threadInfo'],_0x339533=Math[_0x379894(0xa7)](Math[_0x379894(0xc4)]()*0x65),_0x335a54=(await _0x13a44b[_0x379894(0x9a)](_0x185009[_0x379894(0x8d)]))[_0x379894(0xb2)];const _0x2b6bd7=_0x50e62e[_0x379894(0xcf)](),_0x4eaa06=_0x185009['participantIDs'][_0x379894(0x8c)](_0x2bdc55=>_0x2bdc55!=_0x2b6bd7&&_0x2bdc55!=_0x185009['senderID']);var _0x116bce=_0x4eaa06[Math[_0x379894(0xa7)](Math[_0x379894(0xc4)]()*_0x4eaa06['length'])],_0x1d60e8=(await _0x13a44b[_0x379894(0x9a)](_0x116bce))['name'],_0x13987f=[_0x379894(0x93),'https://i.imgur.com/4qT6XAd.png'],_0x42b753=_0x13987f[Math[_0x379894(0xa7)](Math[_0x379894(0xc4)]()*_0x13987f[_0x379894(0xa3)])];let _0xca4376=(await _0x4ca09c[_0x379894(0xc3)](_0x379894(0x94)+_0xaca2ef+_0x379894(0xb0),{'responseType':_0x379894(0xd6)}))[_0x379894(0xcc)];_0x346cb3[_0x379894(0xa8)](_0x5dc42b,Buffer[_0x379894(0xd0)](_0xca4376,'utf-8')),avt1=await this[_0x379894(0xb6)](_0x5dc42b);let _0x51291b=(await _0x4ca09c['get'](_0x379894(0x94)+_0x116bce+_0x379894(0xb0),{'responseType':'arraybuffer'}))[_0x379894(0xcc)];_0x346cb3[_0x379894(0xa8)](_0x40511c,Buffer[_0x379894(0xd0)](_0x51291b,'utf-8')),avt2=await this[_0x379894(0xb6)](_0x40511c);if(!_0x346cb3[_0x379894(0x95)](__dirname+_0x379894(0xa0))){let _0x30d83c=(await _0x4ca09c[_0x379894(0xc3)](_0x379894(0xd1),{'responseType':_0x379894(0xd6)}))[_0x379894(0xcc)];_0x346cb3[_0x379894(0xa8)](__dirname+_0x379894(0xa0),Buffer['from'](_0x30d83c,'utf-8'));}let _0x16fa33=(await _0x4ca09c[_0x379894(0xc3)](''+_0x42b753,{'responseType':_0x379894(0xd6)}))[_0x379894(0xcc)];_0x346cb3['writeFileSync'](_0x408e12,Buffer['from'](_0x16fa33,_0x379894(0xae)));let _0x1405a5=await _0x3f774e(_0x408e12),_0x461628=await _0x3f774e(avt1),_0x296ea9=await _0x3f774e(avt2),_0x2051b2=_0x24e1c3(_0x1405a5['width'],_0x1405a5[_0x379894(0x98)]),_0x2a9ec5=_0x2051b2[_0x379894(0xac)]('2d');_0x2a9ec5[_0x379894(0xc7)](_0x1405a5,0x0,0x0,_0x2051b2[_0x379894(0xad)],_0x2051b2['height']),_0x2a9ec5[_0x379894(0xc7)](_0x461628,0x1bf,0x5c,0x82,0x82),_0x2a9ec5[_0x379894(0xc7)](_0x296ea9,0x55,0x5c,0x82,0x82),_0x435efa(__dirname+_0x379894(0xa0),{'family':'UTM'}),_0x2a9ec5[_0x379894(0xb9)]='start',_0x2a9ec5[_0x379894(0xd2)]=_0x379894(0xca),_0x2a9ec5[_0x379894(0x8f)]=_0x379894(0xd4),_0x2a9ec5['fillText'](''+_0x335a54,0x1db,0x41),_0x2a9ec5['font']='23px\x20UTM',_0x2a9ec5[_0x379894(0x8f)]=_0x379894(0xd4),_0x2a9ec5['fillText'](''+_0x1d60e8,0x64,0x41);const _0x4fb8b7=_0x2051b2[_0x379894(0x92)]();return _0x346cb3[_0x379894(0xa8)](_0x408e12,_0x4fb8b7),_0x346cb3[_0x379894(0xbe)](_0x5dc42b),_0x346cb3['removeSync'](_0x40511c),_0x50e62e['sendMessage']({'body':_0x379894(0xcb)+_0x335a54+_0x379894(0x99)+_0x1d60e8+_0x379894(0xbc)+_0x339533+_0x379894(0x91)+_0x596791+_0x379894(0xb3)+_0x242edf+_0x379894(0xa6)+_0x5127a6,'attachment':_0x346cb3['createReadStream'](_0x408e12)},_0x185009['threadID'],()=>_0x346cb3[_0x379894(0xb8)](_0x408e12));});
 // }
else if (args[0] == "canvas2") {
const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
     const { loadImage, createCanvas, registerFont } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
    const request = require('request');
const res = await axios.get(`https://lechi.click/text/thinh`);
var love = res.data.data;
  // const pidusage = await global.nodemodule["pidusage"](process.pid);
	const moment = require("moment-timezone");
    var gio = moment.tz("Asia/Ho_Chi_Minh").format("D/MM/YYYY || HH:mm:ss");
    var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
     if (thu == 'Sunday') thu = '𝗦𝘂𝗻𝗱𝗮𝘆'
  if (thu == 'Monday') thu = '𝗠𝗼𝗻𝗱𝗮𝘆'
  if (thu == 'Tuesday') thu = '𝗧𝘂𝗲𝘀𝗱𝗮𝘆'
  if (thu == 'Wednesday') thu = '𝗪𝗲𝗱𝗻𝗲𝘀𝗱𝗮𝘆'
  if (thu == "Thursday") thu = '𝗧𝗵𝘂𝗿𝘀𝗱𝗮𝘆'
  if (thu == 'Friday') thu = '𝗙𝗿𝗶𝗱𝗮𝘆'
  if (thu == 'Saturday') thu = '𝗦𝗮𝘁𝘂𝗿𝗱𝗮𝘆'
  let pathImg = __dirname + "/noprefix/mdl.jpg";
  let pathAvt1 = __dirname + "/cache/Av7.png";
  let pathAvt2 = __dirname + "/cache/7.png";
  var id1 = event.senderID;
        var { participantIDs } =(await Threads.getData(event.threadID)).threadInfo;
        var tle = Math.floor(Math.random() * 101);
        var namee = (await Users.getData(event.senderID)).name
        const botID = api.getCurrentUserID();
        const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
        var id = listUserID[Math.floor(Math.random() * listUserID.length)];
        var name = (await Users.getData(id)).name 
var background = ["https://imgur.com/c7Eppap.png"];
    var rd = background[Math.floor(Math.random() * background.length)];
  
        let getAvtmot = (
    await axios.get( `https://graph.facebook.com/${id1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,{ responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));
avt1 = await this.circle(pathAvt1);
        let getAvthai = (await axios.get( `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt2, Buffer.from(getAvthai, "utf-8"));
 avt2 = await this.circle(pathAvt2);             
   if (!fs.existsSync(__dirname +
        `/tad/UTMFacebookK&TItali.ttf`)) {
        let getfont = (await axios.get(`https://drive.google.com/u/0/uc?id=1lh3U5emvpL4wJvxW_M8LFORc4rargy1s&export=download`, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + `/tad/UTMFacebookK&TItali.ttf`, Buffer.from(getfont, "utf-8"));
   }
  let getbackground = (
    await axios.get(`${rd}`, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));
  
    let baseImage = await loadImage(pathImg);
    let baseAvt1 = await loadImage(avt1);
  let baseAvt2 = await loadImage(avt2);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvt1, 447, 92, 130, 130);
ctx.drawImage(baseAvt2, 85, 92, 130, 130);
registerFont(__dirname + `/tad/UTMFacebookK&TItali.ttf`, {
      family: "UTM"
    });
    ctx.textAlign = "start";    
    ctx.font = "23px UTM";
    ctx.fillStyle = "#00000";
    ctx.fillText(`${namee}`, 475, 65);
  ctx.font = "23px UTM";
    ctx.fillStyle = "#00000";
    ctx.fillText(`${name}`, 100, 65);
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt1);
fs.removeSync(pathAvt2);
        return api.sendMessage({body:`💓=== [ 𝗟𝗼𝘃𝗲 𝗖𝗼𝘂𝗽𝗹𝗲 ] ===💓\n━━━━━━━━━━━━\n😽 𝗣𝗮𝗶𝗿𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆\n[❤️] → 𝗬𝗼𝘂𝗿 𝗡𝗮𝗺𝗲: ${namee}\n[🤍] → 𝗧𝗵𝗲𝗶𝗿 𝗡𝗮𝗺𝗲: ${name}\n[🎀] → 𝗖𝗼𝗺𝗽𝗮𝘁𝗶𝗯𝗶𝗹𝗶𝘁𝘆:${tle}%\n[⏰] → 𝗣𝗮𝗶𝗿𝗲𝗱 𝗮𝘁: [ ${thu} | ${gio} ]\n━━━━━━━━━━━━\n[💌] → 𝗟𝗼𝘃𝗲 𝗟𝗶𝗻𝗲: ${love}`,attachment: fs.createReadStream(pathImg) }, event.threadID, () => fs.unlinkSync(pathImg));
} 
  else if (args[0] == "canvas") {
const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
     const { loadImage, createCanvas, registerFont } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
    const request = require('request');
  const res = await axios.get(`https://lechi.click/text/thinh`);
var love = res.data.data;
  // const pidusage = await global.nodemodule["pidusage"](process.pid);
	const moment = require("moment-timezone");
    var gio = moment.tz("Asia/Ho_Chi_Minh").format("D/MM/YYYY || HH:mm:ss");
    var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
     if (thu == 'Sunday') thu = '𝗦𝘂𝗻𝗱𝗮𝘆'
  if (thu == 'Monday') thu = '𝗠𝗼𝗻𝗱𝗮𝘆'
  if (thu == 'Tuesday') thu = '𝗧𝘂𝗲𝘀𝗱𝗮𝘆'
  if (thu == 'Wednesday') thu = '𝗪𝗲𝗱𝗻𝗲𝘀𝗱𝗮𝘆'
  if (thu == "Thursday") thu = '𝗧𝗵𝘂𝗿𝘀𝗱𝗮𝘆'
  if (thu == 'Friday') thu = '𝗙𝗿𝗶𝗱𝗮𝘆'
  if (thu == 'Saturday') thu = '𝗦𝗮𝘁𝘂𝗿𝗱𝗮𝘆'
  let pathImg = __dirname + "/noprefix/mdl.jpg";
  let pathAvt1 = __dirname + "/cache/Av7.png";
  let pathAvt2 = __dirname + "/cache/7.png";
  var id1 = event.senderID;
        var { participantIDs } =(await Threads.getData(event.threadID)).threadInfo;
        var tle = Math.floor(Math.random() * 101);
        var namee = (await Users.getData(event.senderID)).name
        const botID = api.getCurrentUserID();
        const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
        var id = listUserID[Math.floor(Math.random() * listUserID.length)];
        var name = (await Users.getData(id)).name 
var background = ["https://i.imgur.com/jY1fe8e.png"];
    var rd = background[Math.floor(Math.random() * background.length)];
  
        let getAvtmot = (
    await axios.get( `https://graph.facebook.com/${id1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,{ responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));
avt1 = await this.circle(pathAvt1);
        let getAvthai = (await axios.get( `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt2, Buffer.from(getAvthai, "utf-8"));
 avt2 = await this.circle(pathAvt2);             
   if (!fs.existsSync(__dirname +
        `/tad/UTMFacebookK&TItali.ttf`)) {
        let getfont = (await axios.get(`https://drive.google.com/u/0/uc?id=1lh3U5emvpL4wJvxW_M8LFORc4rargy1s&export=download`, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + `/tad/UTMFacebookK&TItali.ttf`, Buffer.from(getfont, "utf-8"));
   }
  let getbackground = (
    await axios.get(`${rd}`, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));
  
    let baseImage = await loadImage(pathImg);
    let baseAvt1 = await loadImage(avt1);
  let baseAvt2 = await loadImage(avt2);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvt1, 160, 93,67, 67);
ctx.drawImage(baseAvt2, 232, 130, 63, 63);
registerFont(__dirname + `/tad/UTMFacebookK&TItali.ttf`, {
      family: "UTM"
    });
    ctx.textAlign = "start";    
    ctx.font = "24px UTM";
    ctx.fillStyle = "#ab65e0";
    ctx.fillText(`${namee}`, 60, 45);
  ctx.font = "24px UTM";
    ctx.fillStyle = "#ab65e0";
    ctx.fillText(`${name}`, 270, 45);
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt1);
fs.removeSync(pathAvt2);
        return api.sendMessage({body:`💗=== [ 𝗟𝗼𝘃𝗲 𝗖𝗼𝘂𝗽𝗹𝗲 ] ===💗 \n😽 𝗣𝗮𝗶𝗿𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆\n🎀 𝗖𝗼𝗺𝗽𝗮𝘁𝗶𝗯𝗶𝗹𝗶𝘁𝘆:${tle}%\n${namee} 💞 ${name}\n━━━━━━━━━━━━━━━━━━\n𝗟𝗼𝘃𝗲 𝗟𝗶𝗻𝗲: ${love}\n━━━━━━━━━━━━━━━━━━\n[ ${thu} | ${gio} ]`,attachment: fs.createReadStream(pathImg) }, event.threadID, () => fs.unlinkSync(pathImg));
} 
  else if (args[0] == "setbd") {
     var data = await Currencies.getData(event.senderID);
        var money = data.money
        if(money < 500) api.sendMessage("𝗬𝗼𝘂 𝗻𝗲𝗲𝗱 𝟱𝟬𝟬$ 𝗳𝗼𝗿 𝟭 𝗽𝗮𝗶𝗿𝗶𝗻𝗴 \𝗻𝗪𝗼𝗿𝗸 𝘁𝗼 𝗴𝗲𝘁 𝗶𝘁 😝",event.threadID,event.messageID)
        else {
        var tl = ['𝟮𝟭%', '𝟲𝟳%', '𝟭𝟵%', '𝟯𝟳%', '𝟭𝟳%', '𝟵𝟲%', '𝟱𝟮%', '𝟲𝟮%', '𝟳𝟲%', '𝟴𝟯%', '𝟭𝟬𝟬%', '𝟵𝟵%', "𝟭𝟬%", "𝟰𝟴%", "𝟱𝟬%", "𝟵𝟬%", "𝟭𝟬𝟬𝟬%", "𝟯𝟬%"];
        var tle = tl[Math.floor(Math.random() * tl.length)];
        let dataa = await api.getUserInfo(event.senderID);
        let namee = await dataa[event.senderID].name
        let loz = await api.getThreadInfo(event.threadID);
        var emoji = loz.participantIDs;
        var id = emoji[Math.floor(Math.random() * emoji.length)];
        let data = await api.getUserInfo(id);
        let name = await data[id].name
        var arraytag = [];
                arraytag.push({id: event.senderID, tag: namee});
                arraytag.push({id: id, tag: name});
        api.changeNickname(`𝗗𝗮𝗿𝗹𝗶𝗻𝗴 𝗢𝗳 ${name} ❤️`, event.threadID, event.senderID);
        api.changeNickname(`𝗟𝗼𝘃𝗲𝗿 𝗢𝗳 ${namee} 💚`, event.threadID, id);
        var sex = await data[id].gender;
        var gender = sex == 2 ? "𝗠𝗮𝗹𝗲 🧑" : sex == 1 ? "𝗙𝗲𝗺𝗮𝗹𝗲 👩‍🦰" : "𝗚𝗮𝘆";
        Currencies.setData(event.senderID, options = {money: money - 500})
        let Avatar = (await axios.get( `https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" } )).data;
            fs.writeFileSync( __dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8") );
        let Avatar2 = (await axios.get( `https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" } )).data;
            fs.writeFileSync( __dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8") );
        var imglove = [];
              imglove.push(fs.createReadStream(__dirname + "/cache/avt.png"));
imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));
        var msg = {body: `💖─ 𝗖𝗼𝗺𝗲 𝗳𝗼𝗿 𝗟𝗼𝘃𝗲 ─💖\n\n𝗣𝗮𝗶𝗿𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 ❤️\n𝗖𝗼𝗺𝗽𝗮𝘁𝗶𝗯𝗶𝗹𝗶𝘁𝘆: ${tle}\n𝗗𝗲𝗱𝘂𝗰𝘁𝗲𝗱 𝟱𝟬𝟬 💸\n`+namee+" "+"💓"+" "+name+"\n", mentions: arraytag, attachment: imglove}
        return api.sendMessage(msg, event.threadID, event.messageID)
  }
  }
  else if (args[0] == "sv") {
    async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"]; 
    const jimp = global.nodemodule["jimp"];
    const __root = path.resolve(__dirname, "cache", "canvas");

    let pairing_img = await jimp.read(__root + "/pairing.png");
    let pathImg = __root + `/pairing_${one}_${two}.png`;
    let avatarOne = __root + `/avt_${one}.png`;
    let avatarTwo = __root + `/avt_${two}.png`;
    
    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
    
    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
    
    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));
    pairing_img.composite(circleOne.resize(150, 150), 980, 200).composite(circleTwo.resize(150, 150), 140, 200);
    
    let raw = await pairing_img.getBufferAsync("image/png");
    
    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);
    
    return pathImg;
}
async function circle(image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}
    const axios = require("axios");
    const fs = require("fs-extra");
    const { threadID, messageID, senderID } = event;
    var tl = ['𝟮𝟭%', '𝟲𝟳%', '𝟭𝟵%', '𝟯𝟳%', '𝟭𝟳%', '𝟵𝟲%', '𝟱𝟮%', '𝟲𝟮%', '𝟳𝟲%', '𝟴𝟯%', '𝟭𝟬𝟬%', '𝟵𝟵%', "𝟬%", "𝟰𝟴%"];
        var tle = tl[Math.floor(Math.random() * tl.length)];
        let dataa = await api.getUserInfo(event.senderID);
        let namee = await dataa[event.senderID].name
        let loz = await api.getThreadInfo(event.threadID);
        var emoji = loz.participantIDs;
        var id = emoji[Math.floor(Math.random() * emoji.length)];
        let data = await api.getUserInfo(id);
        let name = await data[id].name
        var arraytag = [];
                arraytag.push({id: event.senderID, tag: namee});
                arraytag.push({id: id, tag: name});
        
        var sex = await data[id].gender;
        var gender = sex == 2 ? "𝗠𝗮𝗹𝗲 🧑" : sex == 1 ? "𝗙𝗲𝗺𝗮𝗹𝗲 👩‍🦰" : "𝗢𝘁𝗵𝗲𝗿";
var one = senderID, two = id;
    return makeImage({ one, two }).then(path => api.sendMessage({ body: `‎💓=== [ 𝗟𝗼𝘃𝗲 𝗖𝗼𝘂𝗽𝗹𝗲 ] ===💓\n━━━━━━━━━━━━\n😽 𝗣𝗮𝗶𝗿𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆\n🎁 𝗖𝗼𝗻𝗴𝗿𝗮𝘁𝘀 ${namee} 𝗶𝘀 𝗽𝗮𝗶𝗿𝗲𝗱 𝘄𝗶𝘁𝗵 ${name} 🎉\n🎊 𝗖𝗼𝗺𝗽𝗮𝘁𝗶𝗯𝗶𝗹𝗶𝘁𝘆: 〘${tle}〙🥳`, mentions: arraytag, attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID));
  }
else if (args[0] == "tinder") {
  var data = await Currencies.getData(event.senderID); 
var money = data.money
if( money = 0) api.sendMessage(`💓===「 𝗧𝗜𝗡𝗗𝗘𝗥 𝗜𝗡𝗤𝗨𝗜𝗥𝗬 」===💓\n→ 𝗬𝗼𝘂 𝘄𝗮𝗻𝘁 𝘁𝗼 𝗽𝗮𝗶𝗿 𝗴𝗲𝘁 𝟭𝟬𝟬𝟬$ 𝘁𝗵𝗲𝗻 𝗯𝗼𝘁 𝘄𝗶𝗹𝗹 𝗽𝗮𝗶𝗿 𝗳𝗼𝗿 𝘆𝗼𝘂 =))\n→ 𝗬𝗼𝘂𝗿 𝗰𝘂𝗿𝗿𝗲𝗻𝘁 𝗺𝗼𝗻𝗲𝘆: ${money} $`,threadID,messageID)
  else {
  Currencies.setData(event.senderID, options = {money: money - 1000})
	return api.sendMessage(`💓===「 𝗧𝗜𝗡𝗗𝗘𝗥 𝗜𝗡𝗤𝗨𝗜𝗥𝗬 」===💓

→ 𝗴𝗲𝘁𝘁𝗶𝗻𝗴 𝗿𝗲𝗮𝗱𝘆 𝗳𝗼𝗿 𝗽𝗮𝗶𝗿𝗶𝗻𝗴/𝗺𝗮𝘁𝗰𝗵𝗺𝗮𝗸𝗶𝗻𝗴 💍
→ 𝗽𝗹𝗲𝗮𝘀𝗲 𝗥𝗲𝗽𝗹𝘆 𝘁𝗼 𝘁𝗵𝗶𝘀 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘁𝗼 𝗰𝗵𝗼𝗼𝘀𝗲 𝘁𝗵𝗲 𝗴𝗲𝗻𝗱𝗲𝗿 𝘆𝗼𝘂 𝘄𝗮𝗻𝘁 𝘁𝗼 𝗽𝗮𝗶𝗿 𝘄𝗶𝘁𝗵 ( 𝗠𝗮𝗹𝗲 𝗼𝗿 𝗙𝗲𝗺𝗮𝗹𝗲 )
━━━━━━━━━━━━━━━━━━
→ 𝗻𝗼𝘁𝗲 𝗲𝗮𝗰𝗵 𝘁𝗶𝗺𝗲 𝘆𝗼𝘂 𝗽𝗮𝗶𝗿, 𝘁𝗵𝗲 𝗯𝗼𝘁 𝘄𝗶𝗹𝗹 𝗱𝗲𝗱𝘂𝗰𝘁 𝟭𝟬𝟬𝟬 𝗺𝗼𝗻𝗲𝘆/$ 𝗳𝗿𝗼𝗺 𝘆𝗼𝘂𝗿 𝗮𝗰𝗰𝗼𝘂𝗻𝘁 🌸
━━━━━━━━━━━━━━━━━━
→ 𝘆𝗼𝘂𝗿 𝗰𝘂𝗿𝗿𝗲𝗻𝘁 𝗯𝗮𝗹𝗮𝗻𝗰𝗲: ${money} 💵`, event.threadID, (error, info) => {
        global.client.handleReply.push({
            type: "ghep",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID
        })  
     })
  }
}
}

module.exports.handleReply = async ({ api, event, handleReply, Users, Currencies }) => {
var token = `6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
const axios = global.nodemodule["axios"];
const fs = global.nodemodule["fs-extra"];
const tile = (Math.random() * 50)+50;
const random = ["Wish you two a hundred years of happiness", "Wish you two happiness lol", "Wish you two happiness.!"];
    switch(handleReply.type) {
        case "ghep": {
          switch(event.body) {
					case "Trai": {
						api.unsendMessage(handleReply.messageID);
						api.sendMessage(`🌐====「 𝗧𝗜𝗡𝗗𝗘𝗥 𝗦𝗘𝗔𝗥𝗖𝗛 」====🌐

→ 𝗕𝗼𝘁 𝗶𝘀 𝘀𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴/𝗺𝗮𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗠𝗮𝗹𝗲 𝘂𝘀𝗲𝗿 𝘀𝘂𝗶𝘁𝗮𝗯𝗹𝗲 𝗳𝗼𝗿 𝘆𝗼𝘂 🧒...
→ 𝗹𝗼𝗮𝗱𝗶𝗻𝗴, 𝘄𝗮𝗶𝘁 𝗮 𝗺𝗼𝗺𝗲𝗻𝘁...!
━━━━━━━━━━━━━━━━━━`,event.threadID);
            var ThreadInfo = await api.getThreadInfo(event.threadID);
            var all = ThreadInfo.userInfo
            let data = [];
            for (let male of all) {
                if (male.gender == "MALE") {
                 if ( male != event.senderID) data.push(male.id)   
                }
            }
          let member = data[Math.floor(Math.random() * data.length)]
          let n = (await Users.getData(member)).name
          const url = api.getCurrentUserID(member);
          let Avatar_boy = (await axios.get(`https://graph.facebook.com/${member}/picture?height=1500&width=1500&access_token=`+token, { responseType: "arraybuffer" } )).data; 
            fs.writeFileSync( __dirname + `/cache/avt1.png`, Buffer.from(Avatar_boy, "utf-8") );
          let name = await Users.getNameUser(handleReply.author);
          let Avatar_author = (await axios.get( `https://graph.facebook.com/${handleReply.author}/picture?width=512&height=512&access_token=`+token, { responseType: "arraybuffer" } )).data;
            fs.writeFileSync( __dirname + "/cache/avt2.png", Buffer.from(Avatar_author, "utf-8") );
           var arraytag = [];
                arraytag.push({id: handleReply.author, tag: name});
                arraytag.push({id: member, tag: n});
           var imglove = []; 
              imglove.push(fs.createReadStream(__dirname + "/cache/avt1.png"));
              imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));
           var msg = {body: `💙====『 𝗧𝗜𝗡𝗗𝗘𝗥 𝗟𝗢𝗩𝗘 』====💙
━━━━━━━━━━━━━━━━━━

→ 𝗦𝗲𝗮𝗿𝗰𝗵/𝗠𝗮𝘁𝗰𝗵 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹 💍
→ 𝗬𝗼𝘂𝗿 𝗰𝗼𝗺𝗽𝗮𝘁𝗶𝗯𝗶𝗹𝗶𝘁𝘆: ${tile.toFixed(2)}%\n💞 𝗪𝗶𝘀𝗵 𝘆𝗼𝘂 𝘁𝘄𝗼 𝗮 𝗵𝘂𝗻𝗱𝗿𝗲𝗱 𝘆𝗲𝗮𝗿𝘀 𝗼𝗳 𝗵𝗮𝗽𝗽𝗶𝗻𝗲𝘀𝘀\n`+n+" "+"💓"+" "+name, mentions: arraytag, attachment: imglove}
        return api.sendMessage(msg, event.threadID, event.messageID);
          } break;
          case "Gai": {
						api.unsendMessage(handleReply.messageID);
						api.sendMessage(`🌐====「 𝗧𝗜𝗡𝗗𝗘𝗥 𝗦𝗘𝗔𝗥𝗖𝗛 」====🌐

→ 𝗕𝗼𝘁 𝗶𝘀 𝘀𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴/𝗺𝗮𝘁𝗰𝗵𝗶𝗻𝗴 𝗮 𝗙𝗲𝗺𝗮𝗹𝗲 𝘂𝘀𝗲𝗿 𝘀𝘂𝗶𝘁𝗮𝗯𝗹𝗲 𝗳𝗼𝗿 𝘆𝗼𝘂 🧒...
→ 𝗹𝗼𝗮𝗱𝗶𝗻𝗴, 𝘄𝗮𝗶𝘁 𝗮 𝗺𝗼𝗺𝗲𝗻𝘁...!
━━━━━━━━━━━━━━━━━━`,event.threadID);
            var ThreadInfo = await api.getThreadInfo(event.threadID);
            var all = ThreadInfo.userInfo
            let data = [];
            for (let female of all) {
                if (female.gender == "FEMALE") {
                 if ( female != event.senderID) data.push(female.id)   
                }
            }
          let member = data[Math.floor(Math.random() * data.length)]
          let n = (await Users.getData(member)).name
          let Avatar_girl = (await axios.get(`https://graph.facebook.com/${member}/picture?height=1500&width=1500&access_token=`+token, { responseType: "arraybuffer" } )).data; 
            fs.writeFileSync( __dirname + `/cache/avt1.png`, Buffer.from(Avatar_girl, "utf-8") );
          let name = await Users.getNameUser(handleReply.author);
          let Avatar_author = (await axios.get( `https://graph.facebook.com/${handleReply.author}/picture?width=512&height=512&access_token=`+token, { responseType: "arraybuffer" } )).data;
            fs.writeFileSync( __dirname + "/cache/avt2.png", Buffer.from(Avatar_author, "utf-8") );
           var arraytag = [];
                arraytag.push({id: handleReply.author, tag: name});
                arraytag.push({id: member, tag: n});
           var imglove = []; 
              imglove.push(fs.createReadStream(__dirname + "/cache/avt1.png"));
              imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));
           var msg = {body: `💙====『 𝗧𝗜𝗡𝗗𝗘𝗥 𝗟𝗢𝗩𝗘 』====💙
━━━━━━━━━━━━━━━━━━

→ 𝗦𝗲𝗮𝗿𝗰𝗵/𝗠𝗮𝘁𝗰𝗵 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹 💍
→ 𝗬𝗼𝘂𝗿 𝗰𝗼𝗺𝗽𝗮𝘁𝗶𝗯𝗶𝗹𝗶𝘁𝘆: ${tile.toFixed(2)}%\n💞 𝗪𝗶𝘀𝗵 𝘆𝗼𝘂 𝘁𝘄𝗼 𝗮 𝗵𝘂𝗻𝗱𝗿𝗲𝗱 𝘆𝗲𝗮𝗿𝘀 𝗼𝗳 𝗵𝗮𝗽𝗽𝗶𝗻𝗲𝘀𝘀\n`+n+" "+"💓"+" "+name, mentions: arraytag, attachment: imglove}
        return api.sendMessage(msg, event.threadID, event.messageID);
          } break;
        }
      }
    }
}
              