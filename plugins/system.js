const { cmd } = require("../command");
const os = require("os");

cmd({
    pattern: "system",
    alias: ["sys","status","botinfo"],
    desc: "Check bot system status",
    category: "main",
    react: "🖥️",
    filename: __filename
},
async (conn, mek, m, { reply }) => {

try {

    // Uptime
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    // RAM Usage
    const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
    const freeMem = (os.freemem() / 1024 / 1024).toFixed(2);
    const usedMem = (totalMem - freeMem).toFixed(2);

    const systemInfo = `
╭━━〔 🤖 ISHAN SPARK-X SYSTEM 〕━━⬣
┃ ⚙️ Mode      : Public
┃ 🚀 Platform  : ${os.platform()}
┃ 🧠 RAM Used  : ${usedMem} MB
┃ 💾 Total RAM : ${totalMem} MB
┃ ⏳ Uptime    : ${hours}h ${minutes}m ${seconds}s
┃ 🕒 Time      : ${moment().format("HH:mm:ss")}
┃ 📅 Date      : ${moment().format("YYYY-MM-DD")}
╰━━━━━━━━━━━━━━━━━━⬣

> © Developer by ISHAN-X
`;

    reply(systemInfo);

} catch (e) {
    console.log(e);
    reply("❌ System Error Occurred !");
}

});
