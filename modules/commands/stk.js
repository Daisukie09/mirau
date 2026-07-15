module.exports.config = {
  name: "stk",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TuanDz",
  description: "Donate to admin",
  commandCategory: "Admin",
  usages: "stk",
  cooldowns: 5,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
  var link = [
"https://i.imgur.com/2JBbSqo.jpeg"
  ];
	  var callback = () => api.sendMessage({body:`💸 === [ 𝐃𝐎𝐍𝐀𝐓𝐄 ] === 💸\n[💰] → Payment Information\nAccount Holder: Dang Gia khanh \n[💳] → MB Bank: 66640395883706\nAccount Holder: Dang Gia Khanh\n[📌] → Bank please include the bill, anyone with a good heart please occasionally bank a little to buy instant noodles, love you all ❤️`,attachment: fs.createReadStream(__dirname + "/cache/5.jpeg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/5.jpeg")); 
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/5.jpeg")).on("close",() => callback());
   };