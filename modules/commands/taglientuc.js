module.exports.config = {
    name: "taglientuc",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "VanHung & Based on demo by NTKhang",
    description: "Continuously tag the person you tagged 5 times\nCan be considered summoning that person",
    commandCategory: "War/tag",
    usages: "taglientuc @mention",
    cooldowns: 90,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
}

module.exports.run = async function({ api, args, Users, event}) {
    var mention = Object.keys(event.mentions)[0];
    if(!mention) return api.sendMessage("You need to tag 1 person you want to summon", event.threadID);
    let name =  event.mentions[mention];
    var arraytag = [];
        arraytag.push({id: mention, tag: name});
    var a = function (a) { api.sendMessage(a, event.threadID); }
a("Starting summon!");
setTimeout(() => {a({body: "come out and play" + " " + name, mentions: arraytag})} , 3000);
setTimeout(() => {a({body: "come out and play" + " " + name, mentions: arraytag})} , 4000);
setTimeout(() => {a({body: "come out and play" + " " + name, mentions: arraytag})} , 5000);
setTimeout(() => {a({body: "come out and play" + " " + name, mentions: arraytag})} , 6000);
setTimeout(() => {a({body: "come out and play" + " " + name, mentions: arraytag})} , 6500);
setTimeout(() => {a({body: "come out and play" + " " + name, mentions: arraytag})} , 7000);
setTimeout(() => {a({body: "come out and play" + " " + name, mentions: arraytag})} , 7500);
setTimeout(() => {a({body: "come out and play" + " " + name, mentions: arraytag})} , 8000);
setTimeout(() => {a({body: "come out and play" + " " + name, mentions: arraytag})} , 8500);
setTimeout(() => {a({body: "come out and play" + " " + name, mentions: arraytag})} , 9000);
setTimeout(() => {a({body: "come out and play" + " " + name, mentions: arraytag})} , 9500);
setTimeout(() => {a({body: "come out and play" + " " + name, mentions: arraytag})} , 10000);
 }