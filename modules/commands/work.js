exports.config = {
  name: "work",
  version: "0.0.9",
    hasPermssion: 0,
    credits: "Hải harin", 
    description: "Work to earn money, no work no money",
    commandCategory: "Game",
    usages: "[prefix]work",
  countdown: 5,
  envConfig: { cooldownTime: 10 },
  usePrefix: true 
};
exports.run = async function (o){
  const { threadID: t, messageID: m, senderID: s } = o.event;
  const send = (msg, callback) => o.api.sendMessage(msg, t, callback, m) 
  let name = await o.Users.getNameUser(s)
  let data = (await o.Threads.getData(t)).data || {}
  let cooldown = this.config.envConfig.cooldownTime
  if (data["workTime"] && data["workTime"][s] && data["workTime"][s] != "undefined" && cooldown - (Date.now() - data["workTime"][s]) > 0) {
  var time = cooldown - (Date.now() - data["workTime"][s]),
  hours = Math.floor((time / (60000 * 60000 ))/24),
  minutes = Math.floor(time / 60000),
  seconds = ((time % 60000) / 1000).toFixed(0); 
  send(`[ MONEY MAKING TOOL ]
━━━━━━━━━━━━━━━━

📌 You have used up your turns, please come back after ${hours} hours ${minutes} minutes ${seconds} seconds`)
  } else {
  send({ body: `[ MONEY MAKING TOOL ]
━━━━━━━━━━━━━━━━

[ 1 | 🎣 ] Fishing
[ 2 | 🦅 ] Bird hunting
[ 3 | 🏹 ] Animal hunting 
[ 4 | 🍳 ] Cooking
[ 5 | 🪓 ] Wood chopping
[ 6 | 🌾 ] Planting
[ 7 | ⛏️ ] Mining
[ 8 | ⚓ ] Barrel pulling

📌React or reply to this message with the corresponding number to earn money`, attachment: (await require("axios").get("https://i.imgur.com/3PlJX3a.png", { responseType: "stream"})).data }, (e, i) => {
  global.client.handleReply.push({
  name: this.config.name,
  messageID: i.messageID,
  author: s,
  name_author: name
  }),
 global.client.handleReaction.push({
  name: this.config.name,
  messageID: i.messageID,
  author: s,
  name_author: name
  })
  })
  }
  }
exports.handleReaction = async function (o){
  const { threadID: t, messageID: m, userID: s, reaction: r } = o.event;
  const h = o.handleReaction
  o.api.unsendMessage(h.messageID)
  let data = (await o.Threads.getData(t)).data
  const send = (msg, callback) => o.api.sendMessage(msg, t, callback, m)
  if (s != h.author) return send("❎ You are not the command user");
  switch (r) {
  case "🎣": {   
  var rdca = ['Snakehead fish', 'Catfish', 'Salmon', 'Crucian carp', 'Grass carp', 'Goby fish', 'Climbing perch','Silver carp','Red tilapia', 'Catfish eel', 'Tra catfish', 'Elephant ear fish','Cuttlefish','Squid','Bobtail squid','Cuttlebone squid','Egg squid','Giant tiger prawn','School prawn','Vannamei shrimp','Lobster','Iron shrimp','Mud shrimp','Akiami paste shrimp'];
  var linkMap = {
        'Snakehead fish': 'https://i.imgur.com/9n9TTuw.png',
        'Catfish': 'https://i.imgur.com/WqciWwv.png',
        'Salmon': 'https://i.imgur.com/ib1VHM2.png',
        'Crucian carp': 'https://i.imgur.com/NGsRAt3.png',
        'Grass carp': 'https://i.imgur.com/E3Wkvsc.png',
        'Goby fish': 'https://i.imgur.com/etC2pwp.png',
        'Climbing perch': 'https://i.imgur.com/N4L2r1h.png',
        'Silver carp': 'https://i.imgur.com/wOCt3is.png',
        'Red tilapia': 'https://i.imgur.com/HcKxJca.png',
        'Catfish eel': 'https://i.imgur.com/P2hCxpl.png',
        'Tra catfish': 'https://i.imgur.com/fNFszDV.png',
        'Elephant ear fish': 'https://i.imgur.com/8Vig5kM.png',
        'Cuttlefish': 'https://i.imgur.com/A8AKlME.png',
        'Squid': 'https://i.imgur.com/qtO7hdJ.png',
        'Bobtail squid': 'https://i.imgur.com/Kq42m1p.png',
        'Cuttlebone squid': 'https://i.imgur.com/Fvzpfxd.png',
        'Egg squid': 'https://i.imgur.com/qUVNMnu.png',
        'Giant tiger prawn': 'https://i.imgur.com/KBNW3KT.png',
        'School prawn': 'https://i.imgur.com/itRx8hZ.png',
        'Vannamei shrimp': 'https://i.imgur.com/iuPuj6q.png',
        'Lobster': 'https://i.imgur.com/53VNywr.png',
        'Iron shrimp': 'https://i.imgur.com/zVR8eFl.png',
        'Mud shrimp': 'https://i.imgur.com/vSLyjG4.png',
        'Akiami paste shrimp': 'https://i.imgur.com/If7keuk.png'
  };
  var work1 = rdca[Math.floor(Math.random() * rdca.length)];
  var link = linkMap[work1];
  var coins1 = Math.floor(Math.random() * 10000000000000000000000000000) + 200;
  await o.Currencies.increaseMoney(h.author, coins1);
  var image = ['https://i.imgur.com/gMRBv7u.gif', 'https://i.imgur.com/ANpbrx4.gif']
  send({ body: 'Fishing...', attachment: (await require("axios").get(image[Math.floor(Math.random() * image.length)], { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you caught ${work1} and earned ${coins1}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
  }
  break;
  case "🦅": {
  var rdchim = ['Golden oriole','Skylark','Wagtail','Red-whiskered bulbul','Penguin','Budgerigar','Laughingthrush','Nightingale','Peacock','Myna','Parrot','Spotted dove','Ground hornbill','Osprey','Kingfisher','Great tit','Flamingo','Bird of paradise','Blue jay','Goldfinch','White-eye','Golden pheasant','Sparrow','Mandarin duck','Hummingbird'];
  var linkMap = {
  'Golden oriole': 'https://i.imgur.com/IODFTZT.png',
  'Skylark': 'https://i.imgur.com/w18NZ0j.png',
  'Wagtail': 'https://i.imgur.com/F9t6wIM.png',
  'Red-whiskered bulbul': 'https://i.imgur.com/hAjDBb4.png',
  'Penguin': 'https://i.imgur.com/nYZAo1n.png',
  'Budgerigar': 'https://i.imgur.com/w1JpOnb.png',
  'Laughingthrush': 'https://i.imgur.com/zq6Uh8i.png',
  'Nightingale': 'https://i.imgur.com/2HrqZMw.png',
  'Peacock': 'https://i.imgur.com/KwiSalh.png',
  'Myna': 'https://i.imgur.com/kQHM2QU.png',
  'Parrot': 'https://i.imgur.com/AJfELUD.png',
  'Spotted dove': 'https://i.imgur.com/IT0zskz.png',
  'Ground hornbill': 'https://i.imgur.com/8v1reJo.png',
  'Osprey': 'https://i.imgur.com/ZUajQh3.png',
  'Kingfisher': 'https://i.imgur.com/kkzif3R.png',
  'Great tit': 'https://i.imgur.com/kySrcN8.png',
  'Flamingo': 'https://i.imgur.com/8KgmIkT.png',
  'Bird of paradise': 'https://i.imgur.com/Xit2eQw.png',
  'Blue jay': 'https://i.imgur.com/TKFlqDB.png',
  'Goldfinch': 'https://i.imgur.com/LibmANo.png',
  'White-eye': 'https://i.imgur.com/Uvc8Kes.png',
  'Golden pheasant': 'https://i.imgur.com/U29bnyV.png',
  'Sparrow': 'https://i.imgur.com/R21fpw9.png',
  'Mandarin duck': 'https://i.imgur.com/bErM6kt.png',
  'Hummingbird': 'https://i.imgur.com/bjI60RY.png'
  };
  var work2 = rdchim[Math.floor(Math.random() * rdchim.length)];
  var link = linkMap[work2];
  var coins2 = Math.floor(Math.random() * 10000000000000000000000000000) + 100;
  await o.Currencies.increaseMoney(h.author, coins2);
  var image = ["https://i.imgur.com/xRsawOT.gif", "https://i.imgur.com/72o6Mur.gif"]
  send({ body: 'Hunting birds...', attachment: (await require("axios").get(image[Math.floor(Math.random() * image.length)], { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you shot ${work2} and earned ${coins2}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
} 
  break;
  case "🏹": {
  var rdst = ['Tiger','Lion','Elephant','Deer','Monkey','Bear','Seal', 'Albatross', 'Dog', 'Cat', 'Pig', 'Chicken','Ferret','Bamboo rat'];
  var linkMap = {
  'Tiger': 'https://i.imgur.com/HoheUlc.png',
  'Lion': 'https://i.imgur.com/CUWGb3y.png',
  'Elephant': 'https://i.imgur.com/hxKcKKw.png',
  'Deer': 'https://i.imgur.com/KW6qlDJ.png',
  'Monkey': 'https://i.imgur.com/dIfRB8i.png',
  'Bear': 'https://i.imgur.com/Vhi7U57.png',
  'Brown bear': 'https://i.imgur.com/rm1EPHp.jpeg',
  'Seal': 'https://i.imgur.com/f3qPRFx.jpeg',
  'Albatross': 'https://i.imgur.com/esdBcdc.jpeg',
  'Dog': 'https://i.imgur.com/jSLrQju.jpeg',
  'Cat': 'https://i.imgur.com/D3xGABL.jpeg',
  'Pig': 'https://i.imgur.com/Mi65tBI.jpeg',
  'Chicken': 'https://i.imgur.com/zeZBOpo.jpeg',
  'Ferret': 'https://i.imgur.com/zdwr15i.jpeg',
  'Bamboo rat': 'https://i.imgur.com/yGl4za2.jpeg'
  };
  var work3 = rdst[Math.floor(Math.random() * rdst.length)];
  var link = linkMap[work3];
  var coins3 = Math.floor(Math.random() * 10000000000000000000000000000) + 400;
  await o.Currencies.increaseMoney(h.author, coins3);
  var image = ["https://i.imgur.com/aKy5VGW.gif","https://i.imgur.com/naUMa61.gif","https://i.imgur.com/KUjTvpc.gif"]
  send({ body: 'Hunting animals...', attachment: (await require("axios").get(image[Math.floor(Math.random() * image.length)], { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you hunted ${work3} and earned ${coins3}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
  }
  break;
  case "🍳": {
  var rdna = ['Pho','Fish cake','Vietnamese crepe','Water spinach','Spring rolls','Fresh spring rolls','Hue beef noodle soup','Grilled chicken','Steamed rice rolls','Pizza','Caesar salad','Cheeseburger','Mashed potatoes','Spaghetti bolognese','Baked potatoes','French beef stew','Salmon with passion fruit sauce'];
  var linkMap = {
  'Pho': 'https://i.imgur.com/uPYXvsq.png',
  'Fish cake': 'https://i.imgur.com/kO3xF0x.png',
  'Vietnamese crepe': 'https://i.imgur.com/NqO1eLY.png',
  'Water spinach': 'https://i.imgur.com/NHrlJpQ.jpeg',
  'Spring rolls': 'https://i.imgur.com/8kIUE7d.jpeg',
  'Fresh spring rolls': 'https://i.imgur.com/5vPbIQX.jpeg',
  'Hue beef noodle soup': 'https://i.imgur.com/WmsyFxP.jpeg',
  'Grilled chicken': 'https://i.imgur.com/wap9yXx.jpeg',
  'Steamed rice rolls': 'https://i.imgur.com/9uWffvI.png',
  'Pizza': 'https://i.imgur.com/DXCUkfH.jpeg',
  'Caesar salad': 'https://i.imgur.com/VYTcz1U.jpeg',
  'Cheeseburger': 'https://i.imgur.com/rJLL2xy.jpeg',
  'Mashed potatoes': 'https://i.imgur.com/qXXpmie.jpeg',
  'Spaghetti bolognese': 'https://i.imgur.com/PhlIgh1.jpeg',
  'Baked potatoes': 'https://i.imgur.com/YpVQM3H.jpeg',
  'French beef stew': 'https://i.imgur.com/cRkmyUX.jpeg',
  'Salmon with passion fruit sauce': 'https://i.imgur.com/BiTtiNO.jpeg'
  };
  var work4 = rdna[Math.floor(Math.random() * rdna.length)];
  var link = linkMap[work4];
  var coins4 = Math.floor(Math.random() * 10000000000000000000000000000) + 90;
  var image = "https://i.imgur.com/Tptoq8D.gif"
  send({ body: 'Cooking...', attachment: (await require("axios").get(image, { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you cooked ${work4} and earned ${coins4}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
  }
  break;
  case "🪓": {
  var rdcc = ['Oak wood','Birch wood','Acacia wood','Spruce wood','Ironwood','Rosewood','Fragrant wood','Ebony wood','Mahogany','Padauk wood','Jade wood','Padauk wood','Burmese wood','Jackfruit wood','Neem wood'];
  var linkMap = {
  'Oak wood': 'https://i.imgur.com/H8HXVwa.png',
  'Birch wood': 'https://i.imgur.com/xw29rr9.png',
  'Acacia wood': 'https://i.imgur.com/smfz1AY.png',
  'Spruce wood': 'https://i.imgur.com/qWiVr6v.png',
  'Ironwood': 'https://i.imgur.com/K7Pd5eF.png',
  'Rosewood': 'https://i.imgur.com/daiGbSc.png',
  'Fragrant wood': 'https://i.imgur.com/UlJGcnW.png',
  'Ebony wood': 'https://i.imgur.com/1Sidihg.png',
  'Mahogany': 'https://i.imgur.com/cTgBIzh.png',
  'Padauk wood': 'https://i.imgur.com/y8O8hqL.png',
  'Jade wood': 'https://i.imgur.com/G7kbTYu.png',
  'Padauk wood': 'https://i.imgur.com/ihXPbsl.png',
  'Burmese wood': 'https://i.imgur.com/b2DWVg5.png',
  'Jackfruit wood': 'https://i.imgur.com/viKR8TG.png',
  'Neem wood': 'https://i.imgur.com/AC8eush.png'
  };
  var work5 = rdcc[Math.floor(Math.random() * rdcc.length)];
  var link = linkMap[work5];
  var coins5 = Math.floor(Math.random() * 10000000000000000000000000000) + 500;
  await o.Currencies.increaseMoney(h.author, coins5);
  var image = ["https://i.imgur.com/706Rr8j.gif" , "https://i.imgur.com/EN15fDe.gif"]
  send({ body: 'Chopping wood...', attachment: (await require("axios").get(image[Math.floor(Math.random * image.length)], { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you chopped ${work5} and earned ${coins5}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
  }
  break;
  case "🌾": {
  var rdtc = ['Rice plant','Corn plant','Potato plant','Wheat plant','Cassava plant','Star fruit tree','Barley plant','Sweet potato plant','Sugarcane','Peanut plant','Soybean plant','Mung bean plant','Kapok tree','Sesame plant','Tobacco plant','Pineapple plant','Papaya tree','Tomato plant', 'Orange tree', 'Tangerine tree', 'Pomelo tree', 'Apple tree', 'Rambutan tree', 'Watermelon plant', 'Longan tree', 'Lychee tree'];
  var linkMap = {
  'Sugarcane': 'https://i.imgur.com/IaHFRhC.png',
  'Peanut plant': 'https://i.imgur.com/D46xKnp.png',
  'Soybean plant': 'https://i.imgur.com/dMnOCOi.png',
  'Mung bean plant': 'https://i.imgur.com/xi3OnHj.png',
  'Kapok tree': 'https://i.imgur.com/MHcQuwu.png',
  'Sesame plant': 'https://i.imgur.com/xPoe97R.png',
  'Tobacco plant': 'https://i.imgur.com/aAzpc64.png',
  'Pineapple plant': 'https://i.imgur.com/mZCJt7I.png',
  'Papaya tree': 'https://i.imgur.com/vacca7H.png',
  'Rice plant': 'https://i.imgur.com/1uvraj4.png',
  'Corn plant': 'https://i.imgur.com/8us4Zxb.png',
  'Potato plant': 'https://i.imgur.com/Ld1VqaR.png',
  'Wheat plant': 'https://i.imgur.com/DycGgOY.png',
  'Cassava plant': 'https://i.imgur.com/c78qbES.png',
  'Star fruit tree': 'https://i.imgur.com/Y5GUGmV.png',
  'Barley plant': 'https://i.imgur.com/JmNnwQC.png',
  'Sweet potato plant': 'https://i.imgur.com/pnyKcbF.png',
  'Tomato plant': 'https://i.imgur.com/LCBH1rf.jpeg',
  'Orange tree': 'https://i.imgur.com/M9ZMwX2.jpeg',
  'Tangerine tree': 'https://i.imgur.com/Dv9rA98.jpeg',
  'Pomelo tree': 'https://i.imgur.com/HJP06Ub.jpeg',
  'Apple tree': 'https://i.imgur.com/TSPTQaT.jpeg',
  'Rambutan tree': 'https://i.imgur.com/DKQa37x.jpeg',
  'Watermelon plant': 'https://i.imgur.com/SuB8ExQ.jpg',
  'Longan tree': 'https://i.imgur.com/XPwap6p.jpeg',
  'Lychee tree': 'https://i.imgur.com/ViiNwUP.jpeg'
  };
  var work6 = rdtc[Math.floor(Math.random() * rdtc.length)];
  var link = linkMap[work6];
  var coins6 = Math.floor(Math.random() * 10000000000000000000000000000) + 1000;
  await o.Currencies.increaseMoney(h.author, coins6);
  var image = "https://i.imgur.com/HHBF6Yy.gif"
  send({ body: 'Planting...', attachment: (await require("axios").get(image, { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you planted ${work6} and earned ${coins6}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
  }
  break;
  case "⛏️": {
  var rddd = ['Copper', 'Lead', 'Gold', 'Zinc','Iron', 'Aluminum', 'Tin','Manganese','Limestone', 'Clay', 'Sand','Quartz','Diamond','Emerald', 'Ruby','Agate','Sapphire'];
  var linkMap = {
  'Copper': 'https://i.imgur.com/EghuDew.png',
  'Lead': 'https://i.imgur.com/SuHXtP1.png',
  'Gold': 'https://i.imgur.com/cxTORIe.png',
  'Zinc': 'https://i.imgur.com/MujYEyd.png',
  'Iron': 'https://i.imgur.com/yD5IrG4.png',
  'Aluminum': 'https://i.imgur.com/NJcNYCX.png',
  'Tin': 'https://i.imgur.com/yInlgHh.png',
  'Manganese': 'https://i.imgur.com/uyGmRwE.png',
  'Limestone': 'https://i.imgur.com/WXaxHot.png',
  'Clay': 'https://i.imgur.com/Nlh30Lf.png',
  'Sand': 'https://i.imgur.com/DtOq5hX.png',
  'Quartz': 'https://i.imgur.com/oJoN0j7.png',
  'Diamond': 'https://i.imgur.com/69QZHLQ.png',
  'Emerald': 'https://i.imgur.com/DJzj1EN.png',
  'Ruby': 'https://i.imgur.com/lsXUHeJ.png',
  'Agate': 'https://i.imgur.com/bGcW9bN.png',
  'Sapphire': 'https://i.imgur.com/JBOaVEW.png'
  };
  var work7 = rddd[Math.floor(Math.random() * rddd.length)];
  var link = linkMap[work7];
  var coins7 = Math.floor(Math.random() * 10000000000000000000000000000) + 420;
  await o.Currencies.increaseMoney(h.author, coins7);
  var image = "https://i.imgur.com/HHzSQSE.gif"
  send({ body: 'Mining...', attachment: (await require("axios").get(image, { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you mined ${work7} and earned ${coins7}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
  }
  case "⚓": {
  var rdt = ["Cardboard box", "Barrel drum", "Paint bucket", "Plastic bin", "Rice container", "Iron barrel", "Beer keg", "Water tank", "Fish tank", "Trash bin", "Cooler box", "Styrofoam box", "Soda crate", "Shipping container", "Noodle box"];
  var linkMap = {
  "Cardboard box": "https://i.imgur.com/Rv3F13u.jpeg",
  "Barrel drum": "https://i.imgur.com/3XK7J4r.jpeg",
  "Paint bucket": "https://i.imgur.com/9kQB6QF.jpeg",
  "Plastic bin": "https://i.imgur.com/JUcaHDq.jpeg",
  "Rice container": "https://i.imgur.com/TxKZP6C.jpeg",
  "Iron barrel": "https://i.imgur.com/HFPSKX0.jpeg",
  "Beer keg": "https://i.imgur.com/yNymW9i.jpeg",
  "Water tank": "https://i.imgur.com/WVPFdYx.jpeg",
  "Fish tank": "https://i.imgur.com/55Etztj.jpeg",
  "Trash bin": "https://i.imgur.com/9AHLg26.jpeg",
  "Cooler box": "https://i.imgur.com/R3Z8DWX.jpeg",
  "Styrofoam box": "https://i.imgur.com/8rjxtXU.jpeg",
  "Soda crate": "https://i.imgur.com/hqDTCxA.jpeg",
  "Shipping container": "https://i.imgur.com/TlkGrJ7.jpeg",
  "Noodle box": "https://i.imgur.com/CJw9Sid.jpeg",
  }
  var work8 = rdt[Math.floor(Math.random() * rdt.length)];
  var link = linkMap[work8];
  var coins8 = Math.floor(Math.random() * 10000000000000000000000000000) + 500;
  await o.Currencies.increaseMoney(h.author, coins8);
  var image = "https://imgur.com/0eCG0xf.gif"
  send({ body: 'Pulling barrels...', attachment: (await require("axios").get(image, { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you pulled ${work8} and earned ${coins8}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
  }
  break;
  default: send("❎ This icon is not in the list")
  }
}
exports.handleReply = async function (o){
  const { threadID: t, messageID: m, senderID: s, body: b } = o.event;
  const h = o.handleReply
  o.api.unsendMessage(h.messageID)
  const send = (msg, callback) => o.api.sendMessage(msg, t, callback, m)
  let data = (await o.Threads.getData(t)).data
  if (s != h.author) return send("❎ You are not the command user");
  switch (b) {
  case "1": {   
  var rdca = ['Snakehead fish', 'Catfish', 'Salmon', 'Crucian carp', 'Grass carp', 'Goby fish', 'Climbing perch','Silver carp','Red tilapia', 'Catfish eel', 'Tra catfish', 'Elephant ear fish','Cuttlefish','Squid','Bobtail squid','Cuttlebone squid','Egg squid','Giant tiger prawn','School prawn','Vannamei shrimp','Lobster','Iron shrimp','Mud shrimp','Akiami paste shrimp'];
  var linkMap = {
        'Snakehead fish': 'https://i.imgur.com/9n9TTuw.png',
        'Catfish': 'https://i.imgur.com/WqciWwv.png',
        'Salmon': 'https://i.imgur.com/ib1VHM2.png',
        'Crucian carp': 'https://i.imgur.com/NGsRAt3.png',
        'Grass carp': 'https://i.imgur.com/E3Wkvsc.png',
        'Goby fish': 'https://i.imgur.com/etC2pwp.png',
        'Climbing perch': 'https://i.imgur.com/N4L2r1h.png',
        'Silver carp': 'https://i.imgur.com/wOCt3is.png',
        'Red tilapia': 'https://i.imgur.com/HcKxJca.png',
        'Catfish eel': 'https://i.imgur.com/P2hCxpl.png',
        'Tra catfish': 'https://i.imgur.com/fNFszDV.png',
        'Elephant ear fish': 'https://i.imgur.com/8Vig5kM.png',
        'Cuttlefish': 'https://i.imgur.com/A8AKlME.png',
        'Squid': 'https://i.imgur.com/qtO7hdJ.png',
        'Bobtail squid': 'https://i.imgur.com/Kq42m1p.png',
        'Cuttlebone squid': 'https://i.imgur.com/Fvzpfxd.png',
        'Egg squid': 'https://i.imgur.com/qUVNMnu.png',
        'Giant tiger prawn': 'https://i.imgur.com/KBNW3KT.png',
        'School prawn': 'https://i.imgur.com/itRx8hZ.png',
        'Vannamei shrimp': 'https://i.imgur.com/iuPuj6q.png',
        'Lobster': 'https://i.imgur.com/53VNywr.png',
        'Iron shrimp': 'https://i.imgur.com/zVR8eFl.png',
        'Mud shrimp': 'https://i.imgur.com/vSLyjG4.png',
        'Akiami paste shrimp': 'https://i.imgur.com/If7keuk.png'
  };
  var work1 = rdca[Math.floor(Math.random() * rdca.length)];
  var link = linkMap[work1];
  var coins1 = Math.floor(Math.random() * 10000000000000000000000000000) + 200;
  await o.Currencies.increaseMoney(h.author, coins1);
  var image = ['https://i.imgur.com/gMRBv7u.gif', 'https://i.imgur.com/ANpbrx4.gif']
  send({ body: 'Fishing...', attachment: (await require("axios").get(image[Math.floor(Math.random() * image.length)], { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you caught ${work1} and earned ${coins1}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
  }
  break;
  case "2": {
  var rdchim = ['Golden oriole','Skylark','Wagtail','Red-whiskered bulbul','Penguin','Budgerigar','Laughingthrush','Nightingale','Peacock','Myna','Parrot','Spotted dove','Ground hornbill','Osprey','Kingfisher','Great tit','Flamingo','Bird of paradise','Blue jay','Goldfinch','White-eye','Golden pheasant','Sparrow','Mandarin duck','Hummingbird'];
  var linkMap = {
  'Golden oriole': 'https://i.imgur.com/IODFTZT.png',
  'Skylark': 'https://i.imgur.com/w18NZ0j.png',
  'Wagtail': 'https://i.imgur.com/F9t6wIM.png',
  'Red-whiskered bulbul': 'https://i.imgur.com/hAjDBb4.png',
  'Penguin': 'https://i.imgur.com/nYZAo1n.png',
  'Budgerigar': 'https://i.imgur.com/w1JpOnb.png',
  'Laughingthrush': 'https://i.imgur.com/zq6Uh8i.png',
  'Nightingale': 'https://i.imgur.com/2HrqZMw.png',
  'Peacock': 'https://i.imgur.com/KwiSalh.png',
  'Myna': 'https://i.imgur.com/kQHM2QU.png',
  'Parrot': 'https://i.imgur.com/AJfELUD.png',
  'Spotted dove': 'https://i.imgur.com/IT0zskz.png',
  'Ground hornbill': 'https://i.imgur.com/8v1reJo.png',
  'Osprey': 'https://i.imgur.com/ZUajQh3.png',
  'Kingfisher': 'https://i.imgur.com/kkzif3R.png',
  'Great tit': 'https://i.imgur.com/kySrcN8.png',
  'Flamingo': 'https://i.imgur.com/8KgmIkT.png',
  'Bird of paradise': 'https://i.imgur.com/Xit2eQw.png',
  'Blue jay': 'https://i.imgur.com/TKFlqDB.png',
  'Goldfinch': 'https://i.imgur.com/LibmANo.png',
  'White-eye': 'https://i.imgur.com/Uvc8Kes.png',
  'Golden pheasant': 'https://i.imgur.com/U29bnyV.png',
  'Sparrow': 'https://i.imgur.com/R21fpw9.png',
  'Mandarin duck': 'https://i.imgur.com/bErM6kt.png',
  'Hummingbird': 'https://i.imgur.com/bjI60RY.png'
  };
  var work2 = rdchim[Math.floor(Math.random() * rdchim.length)];
  var link = linkMap[work2];
  var coins2 = Math.floor(Math.random() * 10000000000000000000000000000) + 100;
  await o.Currencies.increaseMoney(h.author, coins2);
  var image = ["https://i.imgur.com/xRsawOT.gif", "https://i.imgur.com/72o6Mur.gif"]
  send({ body: 'Hunting birds...', attachment: (await require("axios").get(image[Math.floor(Math.random() * image.length)], { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you shot ${work2} and earned ${coins2}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
} 
  break;
  case "3": {
  var rdst = ['Tiger','Lion','Elephant','Deer','Monkey','Bear','Seal', 'Albatross', 'Dog', 'Cat', 'Pig', 'Chicken','Ferret','Bamboo rat'];
  var linkMap = {
  'Tiger': 'https://i.imgur.com/HoheUlc.png',
  'Lion': 'https://i.imgur.com/CUWGb3y.png',
  'Elephant': 'https://i.imgur.com/hxKcKKw.png',
  'Deer': 'https://i.imgur.com/KW6qlDJ.png',
  'Monkey': 'https://i.imgur.com/dIfRB8i.png',
  'Bear': 'https://i.imgur.com/Vhi7U57.png',
  'Brown bear': 'https://i.imgur.com/rm1EPHp.jpeg',
  'Seal': 'https://i.imgur.com/f3qPRFx.jpeg',
  'Albatross': 'https://i.imgur.com/esdBcdc.jpeg',
  'Dog': 'https://i.imgur.com/jSLrQju.jpeg',
  'Cat': 'https://i.imgur.com/D3xGABL.jpeg',
  'Pig': 'https://i.imgur.com/Mi65tBI.jpeg',
  'Chicken': 'https://i.imgur.com/zeZBOpo.jpeg',
  'Ferret': 'https://i.imgur.com/zdwr15i.jpeg',
  'Bamboo rat': 'https://i.imgur.com/yGl4za2.jpeg'
  };
  var work3 = rdst[Math.floor(Math.random() * rdst.length)];
  var link = linkMap[work3];
  var coins3 = Math.floor(Math.random() * 10000000000000000000000000000) + 400;
  await o.Currencies.increaseMoney(h.author, coins3);
  var image = ["https://i.imgur.com/aKy5VGW.gif","https://i.imgur.com/naUMa61.gif","https://i.imgur.com/KUjTvpc.gif"]
  send({ body: 'Hunting animals...', attachment: (await require("axios").get(image[Math.floor(Math.random() * image.length)], { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you hunted ${work3} and earned ${coins3}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
  }
  break;
  case "4": {
  var rdna = ['Pho','Fish cake','Vietnamese crepe','Water spinach','Spring rolls','Fresh spring rolls','Hue beef noodle soup','Grilled chicken','Steamed rice rolls','Pizza','Caesar salad','Cheeseburger','Mashed potatoes','Spaghetti bolognese','Baked potatoes','French beef stew','Salmon with passion fruit sauce'];
  var linkMap = {
  'Pho': 'https://i.imgur.com/uPYXvsq.png',
  'Fish cake': 'https://i.imgur.com/kO3xF0x.png',
  'Vietnamese crepe': 'https://i.imgur.com/NqO1eLY.png',
  'Water spinach': 'https://i.imgur.com/NHrlJpQ.jpeg',
  'Spring rolls': 'https://i.imgur.com/8kIUE7d.jpeg',
  'Fresh spring rolls': 'https://i.imgur.com/5vPbIQX.jpeg',
  'Hue beef noodle soup': 'https://i.imgur.com/WmsyFxP.jpeg',
  'Grilled chicken': 'https://i.imgur.com/wap9yXx.jpeg',
  'Steamed rice rolls': 'https://i.imgur.com/9uWffvI.png',
  'Pizza': 'https://i.imgur.com/DXCUkfH.jpeg',
  'Caesar salad': 'https://i.imgur.com/VYTcz1U.jpeg',
  'Cheeseburger': 'https://i.imgur.com/rJLL2xy.jpeg',
  'Mashed potatoes': 'https://i.imgur.com/qXXpmie.jpeg',
  'Spaghetti bolognese': 'https://i.imgur.com/PhlIgh1.jpeg',
  'Baked potatoes': 'https://i.imgur.com/YpVQM3H.jpeg',
  'French beef stew': 'https://i.imgur.com/cRkmyUX.jpeg',
  'Salmon with passion fruit sauce': 'https://i.imgur.com/BiTtiNO.jpeg'
  };
  var work4 = rdna[Math.floor(Math.random() * rdna.length)];
  var link = linkMap[work4];
  var coins4 = Math.floor(Math.random() * 10000000000000000000000000000) + 90;
  var image = "https://i.imgur.com/Tptoq8D.gif"
  send({ body: 'Cooking...', attachment: (await require("axios").get(image, { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you cooked ${work4} and earned ${coins4}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
  }
  break;
  case "5": {
  var rdcc = ['Oak wood','Birch wood','Acacia wood','Spruce wood','Ironwood','Rosewood','Fragrant wood','Ebony wood','Mahogany','Padauk wood','Jade wood','Padauk wood','Burmese wood','Jackfruit wood','Neem wood'];
  var linkMap = {
  'Oak wood': 'https://i.imgur.com/H8HXVwa.png',
  'Birch wood': 'https://i.imgur.com/xw29rr9.png',
  'Acacia wood': 'https://i.imgur.com/smfz1AY.png',
  'Spruce wood': 'https://i.imgur.com/qWiVr6v.png',
  'Ironwood': 'https://i.imgur.com/K7Pd5eF.png',
  'Rosewood': 'https://i.imgur.com/daiGbSc.png',
  'Fragrant wood': 'https://i.imgur.com/UlJGcnW.png',
  'Ebony wood': 'https://i.imgur.com/1Sidihg.png',
  'Mahogany': 'https://i.imgur.com/cTgBIzh.png',
  'Padauk wood': 'https://i.imgur.com/y8O8hqL.png',
  'Jade wood': 'https://i.imgur.com/G7kbTYu.png',
  'Padauk wood': 'https://i.imgur.com/ihXPbsl.png',
  'Burmese wood': 'https://i.imgur.com/b2DWVg5.png',
  'Jackfruit wood': 'https://i.imgur.com/viKR8TG.png',
  'Neem wood': 'https://i.imgur.com/AC8eush.png'
  };
  var work5 = rdcc[Math.floor(Math.random() * rdcc.length)];
  var link = linkMap[work5];
  var coins5 = Math.floor(Math.random() * 10000000000000000000000000000) + 500;
  await o.Currencies.increaseMoney(h.author, coins5);
  var image = ["https://i.imgur.com/706Rr8j.gif" , "https://i.imgur.com/EN15fDe.gif"]
  send({ body: 'Chopping wood...', attachment: (await require("axios").get(image[Math.floor(Math.random * image.length)], { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you chopped ${work5} and earned ${coins5}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
  }
  break;
  case "6": {
  var rdtc = ['Rice plant','Corn plant','Potato plant','Wheat plant','Cassava plant','Star fruit tree','Barley plant','Sweet potato plant','Sugarcane','Peanut plant','Soybean plant','Mung bean plant','Kapok tree','Sesame plant','Tobacco plant','Pineapple plant','Papaya tree','Tomato plant', 'Orange tree', 'Tangerine tree', 'Pomelo tree', 'Apple tree', 'Rambutan tree', 'Watermelon plant', 'Longan tree', 'Lychee tree'];
  var linkMap = {
  'Sugarcane': 'https://i.imgur.com/IaHFRhC.png',
  'Peanut plant': 'https://i.imgur.com/D46xKnp.png',
  'Soybean plant': 'https://i.imgur.com/dMnOCOi.png',
  'Mung bean plant': 'https://i.imgur.com/xi3OnHj.png',
  'Kapok tree': 'https://i.imgur.com/MHcQuwu.png',
  'Sesame plant': 'https://i.imgur.com/xPoe97R.png',
  'Tobacco plant': 'https://i.imgur.com/aAzpc64.png',
  'Pineapple plant': 'https://i.imgur.com/mZCJt7I.png',
  'Papaya tree': 'https://i.imgur.com/vacca7H.png',
  'Rice plant': 'https://i.imgur.com/1uvraj4.png',
  'Corn plant': 'https://i.imgur.com/8us4Zxb.png',
  'Potato plant': 'https://i.imgur.com/Ld1VqaR.png',
  'Wheat plant': 'https://i.imgur.com/DycGgOY.png',
  'Cassava plant': 'https://i.imgur.com/c78qbES.png',
  'Star fruit tree': 'https://i.imgur.com/Y5GUGmV.png',
  'Barley plant': 'https://i.imgur.com/JmNnwQC.png',
  'Sweet potato plant': 'https://i.imgur.com/pnyKcbF.png',
  'Tomato plant': 'https://i.imgur.com/LCBH1rf.jpeg',
  'Orange tree': 'https://i.imgur.com/M9ZMwX2.jpeg',
  'Tangerine tree': 'https://i.imgur.com/Dv9rA98.jpeg',
  'Pomelo tree': 'https://i.imgur.com/HJP06Ub.jpeg',
  'Apple tree': 'https://i.imgur.com/TSPTQaT.jpeg',
  'Rambutan tree': 'https://i.imgur.com/DKQa37x.jpeg',
  'Watermelon plant': 'https://i.imgur.com/SuB8ExQ.jpg',
  'Longan tree': 'https://i.imgur.com/XPwap6p.jpeg',
  'Lychee tree': 'https://i.imgur.com/ViiNwUP.jpeg'
  };
  var work6 = rdtc[Math.floor(Math.random() * rdtc.length)];
  var link = linkMap[work6];
  var coins6 = Math.floor(Math.random() * 10000000000000000000000000000) + 1000;
  await o.Currencies.increaseMoney(h.author, coins6);
  var image = "https://i.imgur.com/HHBF6Yy.gif"
  send({ body: 'Planting...', attachment: (await require("axios").get(image, { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you planted ${work6} and earned ${coins6}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
  }
  break;
  case "7": {
  var rddd = ['Copper', 'Lead', 'Gold', 'Zinc','Iron', 'Aluminum', 'Tin','Manganese','Limestone', 'Clay', 'Sand','Quartz','Diamond','Emerald', 'Ruby','Agate','Sapphire'];
  var linkMap = {
  'Copper': 'https://i.imgur.com/EghuDew.png',
  'Lead': 'https://i.imgur.com/SuHXtP1.png',
  'Gold': 'https://i.imgur.com/cxTORIe.png',
  'Zinc': 'https://i.imgur.com/MujYEyd.png',
  'Iron': 'https://i.imgur.com/yD5IrG4.png',
  'Aluminum': 'https://i.imgur.com/NJcNYCX.png',
  'Tin': 'https://i.imgur.com/yInlgHh.png',
  'Manganese': 'https://i.imgur.com/uyGmRwE.png',
  'Limestone': 'https://i.imgur.com/WXaxHot.png',
  'Clay': 'https://i.imgur.com/Nlh30Lf.png',
  'Sand': 'https://i.imgur.com/DtOq5hX.png',
  'Quartz': 'https://i.imgur.com/oJoN0j7.png',
  'Diamond': 'https://i.imgur.com/69QZHLQ.png',
  'Emerald': 'https://i.imgur.com/DJzj1EN.png',
  'Ruby': 'https://i.imgur.com/lsXUHeJ.png',
  'Agate': 'https://i.imgur.com/bGcW9bN.png',
  'Sapphire': 'https://i.imgur.com/JBOaVEW.png'
  };
  var work7 = rddd[Math.floor(Math.random() * rddd.length)];
  var link = linkMap[work7];
  var coins7 = Math.floor(Math.random() * 10000000000000000000000000000) + 420;
  await o.Currencies.increaseMoney(h.author, coins7);
  var image = "https://i.imgur.com/HHzSQSE.gif"
  send({ body: 'Mining...', attachment: (await require("axios").get(image, { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you mined ${work7} and earned ${coins7}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
  }
  break;
  case "8": {
  var rdt = ["Cardboard box", "Barrel drum", "Paint bucket", "Plastic bin", "Rice container", "Iron barrel", "Beer keg", "Water tank", "Fish tank", "Trash bin", "Cooler box", "Styrofoam box", "Soda crate", "Shipping container", "Noodle box"];
  var linkMap = {
  "Cardboard box": "https://i.imgur.com/Rv3F13u.jpeg",
  "Barrel drum": "https://i.imgur.com/3XK7J4r.jpeg",
  "Paint bucket": "https://i.imgur.com/9kQB6QF.jpeg",
  "Plastic bin": "https://i.imgur.com/JUcaHDq.jpeg",
  "Rice container": "https://i.imgur.com/TxKZP6C.jpeg",
  "Iron barrel": "https://i.imgur.com/HFPSKX0.jpeg",
  "Beer keg": "https://i.imgur.com/yNymW9i.jpeg",
  "Water tank": "https://i.imgur.com/WVPFdYx.jpeg",
  "Fish tank": "https://i.imgur.com/55Etztj.jpeg",
  "Trash bin": "https://i.imgur.com/9AHLg26.jpeg",
  "Cooler box": "https://i.imgur.com/R3Z8DWX.jpeg",
  "Styrofoam box": "https://i.imgur.com/8rjxtXU.jpeg",
  "Soda crate": "https://i.imgur.com/hqDTCxA.jpeg",
  "Shipping container": "https://i.imgur.com/TlkGrJ7.jpeg",
  "Noodle box": "https://i.imgur.com/CJw9Sid.jpeg",
  }
  var work8 = rdt[Math.floor(Math.random() * rdt.length)];
  var link = linkMap[work8];
  var coins8 = Math.floor(Math.random() * 10000000000000000000000000000) + 500;
  await o.Currencies.increaseMoney(h.author, coins8);
  var image = "https://imgur.com/0eCG0xf.gif"
  send({ body: 'Pulling barrels...', attachment: (await require("axios").get(image, { responseType: "stream"})).data }, async () => send({ body: `Congratulations ${h.name_author}, you pulled ${work8} and earned ${coins8}₫`, attachment: (await require("axios").get(link, { responseType: "stream"})).data }, async() => {
  data["workTime"] ? data["workTime"] : data["workTime"] = {}
  data["workTime"][h.author] = Date.now()
  await o.Threads.setData(t, { data })
  global.data.threadData.set(t, data)
  }))
  }
  break;
  default: const choose = parseInt(b);
  if (isNaN(b)) return send("𝗣𝗹𝗲𝗮𝘀𝗲 𝗰𝗵𝗼𝗼𝘀𝗲 𝗮 𝗻𝘂𝗺𝗯𝗲𝗿");
  if (choose > 8 || choose < 1) return send("𝗖𝗵𝗼𝗶𝗰𝗲 𝗶𝘀 𝗻𝗼𝘁 𝗶𝗻 𝘁𝗵𝗲 𝗹𝗶𝘀𝘁."); 
  }
}
