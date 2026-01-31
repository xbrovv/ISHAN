const { cmd, commands } = require("../command");
const os = require("os");
const config = require("../config");

const pendingMenu = {};
const numberEmojis = ["0️⃣","❶","❷","❸","❹","❺","❻","❼","❽","❾"];

const HEADER_IMG = "https://files.catbox.moe/h1xuqv.jpg";

const FOOTER = `
© 2026 ISHAN-X MD
`;

function formatBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

cmd({
  pattern: "menu",
  react: "👑",
  desc: "Get Bot Menu",
  category: "main",
  filename: __filename
}, async (ishan, mek, m, { from, sender, pushname }) => {

  const commandMap = {};
  for (const cmd of commands) {
    if (cmd.dontAddCommandList) continue;
    const cat = (cmd.category || "other").toUpperCase();
    if (!commandMap[cat]) commandMap[cat] = [];
    commandMap[cat].push(cmd);
  }

  const categories = Object.keys(commandMap);

  // 📊 SYSTEM INFO
  const usedRam = process.memoryUsage().heapUsed;
  const totalRam = os.totalmem();
  const cpuModel = os.cpus()[0].model;
  const cpuUsage = os.loadavg()[0].toFixed(2);

  let text = `
👋 Hello, ${pushname}

🧿 *WELCOME TO ISHAN-SPARK-X MD* 🧿

╭─「 STATUS DETAILS 」
│ 🧑‍💻 Owner : Ishan 
│ 📌 Prefix : ${config.PREFIX || "."}
│ 📞 Owner Number : 94761638379
│ ⚙ Mode : ${config.MODE || "public"}
│ 💾 RAM Usage : ${formatBytes(usedRam)} / ${formatBytes(totalRam)}
│ 💻 CPU Load : ${cpuUsage}
│ ⏰ Time : ${new Date().toLocaleTimeString()}
│ 📅 Date : ${new Date().toISOString().split("T")[0]}
│ 📂 Categories : ${categories.length}
╰───────────────

📩 *Reply Below Number*
`;

  categories.forEach((cat, i) => {
    text += `\n${i + 1}️⃣ ${cat} MENU`;
  });

  text += `\n\n${FOOTER}`;

  await ishan.sendMessage(from, {
    image: { url: HEADER_IMG },
    caption: text
  }, { quoted: mek });

  pendingMenu[sender] = { step: "category", categories, commandMap };
});


// ───── CATEGORY SELECT ─────
cmd({
  filter: (text, { sender }) =>
    pendingMenu[sender] &&
    pendingMenu[sender].step === "category" &&
    /^[1-9][0-9]*$/.test(text.trim())
}, async (ishan, mek, m, { from, body, sender }) => {

  const data = pendingMenu[sender];
  const index = Number(body.trim()) - 1;

  if (!data.categories[index]) {
    return ishan.sendMessage(from, { text: "❌ Invalid Number" }, { quoted: mek });
  }

  // ✅ Add react to the original selection message
  await ishan.sendMessage(from, { react: { text: "✅", key: mek.key } });

  const category = data.categories[index];
  const cmds = data.commandMap[category];

  let text = `
🎀 ＝ ${category} COMMAND LIST ＝ 🎀
`;

  cmds.forEach(c => {
    text += `
╭──────────●●►
│ヤ Command : ${c.pattern}
│ヤ Use : ${config.PREFIX || "."}${c.pattern} ${c.use || "<Query>"}
╰──────────●●►
`;
  });

  text += `\n${FOOTER}`;

  await ishan.sendMessage(from, {
    image: { url: HEADER_IMG },
    caption: text
  }, { quoted: mek });

  delete pendingMenu[sender];
});
    
