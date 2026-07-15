this.config = {
  name: "run",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Niio-team (Quất)",
  description: "running shell",
  commandCategory: "Admin",
  usages: "[Script]",
  cooldowns: 5
}
this.run = async ({ api, event, args, Threads, Users, Currencies, models, permssion }) => {
  //if (event.senderID != global.config.ADMINBOT[0]) return api.sendMessage('⚠️ You do not have permission to use this command', event.threadID, event.messageID)
  const s = a => {
    if (typeof a == "object" || typeof a == "array") { if (Object.keys(a).length != 0) a = JSON.stringify(a, null, 4); else a = "" }
    if (typeof a == "number") a = a.toString()
    return api.sendMessage(a, event.threadID, event.messageID)
  },
  {log} = console, { quất } = api
mocky = async a => {
if (typeof a == "object" || typeof a == "array") { if (Object.keys(a).length != 0) a = JSON.stringify(a, null, 4); else a = "" }
if (typeof a == "number") a = a.toString()
await require('axios').post("https://api.mocky.io/api/mock", { 
"status": 200, 
"content": a,
"content_type": "application/json",
"charset": "UTF-8", 
"secret": "cc", 
"expiration": "never" }).then(r => s(r.data.link))
}
  try {
    return s(await require("eval")(args.join(" "), {
      s,
      api,
      event,
      args,
      Threads,
      Users,
      Currencies,
      models,
      global,
      permssion,
      log,
mocky,
quất
    }, true))
  }
  catch (e) {
    s(`⚠️ Error: ${e.message}\n📝 Translation: ${(await require('axios').get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(e.message)}`)).data[0][0][0]}`)
  }
}
