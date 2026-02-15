const { cmd } = require("../command");
const os = require("os");

cmd({
  pattern: "ping",
  react: "🚀",
  desc: "Check response time with fancy look",
  category: "main",
  filename: __filename
}, async (ishan, mek, m, { from }) => {

  const start = Date.now();

  await ishan.sendMessage(
    from,
    { text: "⚡ Checking ping......" },
    { quoted: mek }
  );

  const latency = Date.now() - start;

  // Runtime
  const up = process.uptime();
  const h = Math.floor(up / 3600);
  const mi = Math.floor((up % 3600) / 60);
  const s = Math.floor(up % 60);
  const runtime = `${h}h ${mi}m ${s}s`;

  // CPU usage
  const cores = os.cpus().length || 1;
  const load = os.loadavg()[0] || 0;
  const cpuUsage = Math.min(99, Math.max(1, Math.round((load / cores) * 100)));

  // 🧠 RAM / Memory usage
  const totalRam = os.totalmem() / 1024 / 1024; // MB
  const freeRam = os.freemem() / 1024 / 1024;   // MB
  const usedRam = totalRam - freeRam;

  const botMemory = process.memoryUsage().rss / 1024 / 1024; // MB

  const DASHBOARD_IMAGE = "https://files.catbox.moe/66txio.JPG";

  const caption = `
🧬 𝗦𝗣𝗔𝗥𝗞 -𝗫 𝗦𝗬𝗦𝗧𝗘𝗠 𝗗𝗔𝗦𝗛𝗕𝗢𝗔𝗥𝗗
_𝗜𝗦𝗛𝗔𝗡-𝕏 Instance • Real-Time Monitor_

*Bot Status* ⬡
*⟮────────────────────────────⟯*
┃ ✦ *Runtime* : ${runtime}
┃ ✦ *Respond Speed* : ${latency} ms
┃ ✦ *CPU Usage* : ${cpuUsage}%
┃ ✦ *RAM Usage* : ${usedRam.toFixed(1)} / ${totalRam.toFixed(1)} MB
┃ ✦ *Bot Memory* : ${botMemory.toFixed(1)} MB
*⟮────────────────────────────⟯*

*🅂🄿🄰🅁🄺-🅇🄼🄳*
`.trim();

  await ishan.sendMessage(from, {
    image: { url: DASHBOARD_IMAGE },
    caption
  }, { quoted: mek });

});
