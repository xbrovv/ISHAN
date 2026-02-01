const { cmd, commands } = require("../command");
const os = require("os");
const config = require("../config");

const pendingMenu = {};
const numberEmojis = ["0️⃣","❶","❷","❸","❹","❺","❻","❼","❽","❾"];

const HEADER_IMG = "https://files.catbox.moe/h1xuqv.jpg";

const FOOTER = `
© 2026 ISHAN-X MD
`;

cmd({
  pattern: "menu",
  react: "👑",
  desc: "Get Bot Menu",
  category: "main",
  filename: __filename
}, async (ishan, mek, m, { from, sender, pushname }) => {

  // CATEGORY MAP
  const commandMap = {
    OWNER: [],
    MAIN: [],
    MOVIE: [],
    DOWNLOAD: [],
    SEARCH: [],
    AI: [],
    GROUP: [],
    MATHTOOL: [],
    LOGO: []
  };

  for (const c of commands) {
    if (c.dontAddCommandList) continue;
    const cat = (c.category || "other").toUpperCase();
    if (commandMap[cat]) commandMap[cat].push(c);
  }

  const categories = Object.keys(commandMap);

  // ───── SYSTEM INFO ─────
  const usedRAM = Math.round(process.memoryUsage().rss / 1024 / 1024);
  const totalRAM = Math.round(os.totalmem() / 1024 / 1024);

  const cpuModel = os.cpus()[0].model;
  const platform = os.platform();

  const uptime = process.uptime();
  const upH = Math.floor(uptime / 3600);
  const upM = Math.floor((uptime % 3600) / 60);
  const upS = Math.floor(uptime % 60);

  let text = `
👋 Hello, ${pushname}

🧿 *WELCOME TO ISHAN-SPARK-X MD* 🧿

╭─「 *STATUS DETAILS* 」────◆◆►
│ 🧑‍💻 Owner : Ishan
│ 📌 Prefix : ${config.PREFIX || "."}
│ 🎲 Mode : ${config.MODE || "public"}
│ 💻 Platform : ${platform}
│ 📞 Owner Number : 94761638379
│ 💾 RAM : ${usedRAM} MB / ${totalRAM} MB
│ ⏱️ Uptime : ${upH}h ${upM}m ${upS}s
│ ⏰ Time : ${new Date().toLocaleTimeString()}
│ 📅 Date : ${new Date().toISOString().split("T")[0]}
│ 📂 Categories : ${categories.length}
╰───────────────◆◆►

*Reply Below Number 🔢*

╭──────────●●►
│📖 *LIST MENU*
│   ───────
│ _❶_  *OWNER*
│ _❷_  *MAIN*
│ _❸_  *MOVIE* [🎞️]
│ _❹_  *DOWNLOAD*
│ _❺_  *SEARCH*
│ _❻_  *AI*
│ _❼_  *GROUP*
│ _❽_  *MATHTOOL*
│ _❾_  *LOGO*   
╰───────────●●►

${FOOTER}
`;

  await ishan.sendMessage(from, {
    image: { url: HEADER_IMG },
    caption: text
  }, { quoted: mek });

  pendingMenu[sender] = {
    step: "category",
    categories,
    commandMap
  };
});


// ───── CATEGORY SELECT ─────
cmd({
  filter: (text, { sender }) =>
    pendingMenu[sender] &&
    pendingMenu[sender].step === "category" &&
    /^[1-9]$/.test(text.trim())
}, async (ishan, mek, m, { from, body, sender }) => {

  const data = pendingMenu[sender];
  const index = Number(body.trim()) - 1;

  const category = data.categories[index];
  if (!category) {
    return ishan.sendMessage(from, { text: "❌ Invalid Number" }, { quoted: mek });
  }

  // ✅ react
  await ishan.sendMessage(from, {
    react: { text: "✅", key: mek.key }
  });

  const cmds = data.commandMap[category];

  let text = `
🎀 ＝ ${category} MENU ＝ 🎀
`;

  if (!cmds.length) {
    text += `\n❌ No commands found\n`;
  } else {
    cmds.forEach(c => {
      text += `
╭──────────●●►
│ ヤ Command : ${c.pattern}
│ ヤ Use : ${config.PREFIX || "."}${c.pattern} ${c.use || ""}
╰──────────●●►
`;
    });
  }

  text += `\n${FOOTER}`;

  await ishan.sendMessage(from, {
    image: { url: HEADER_IMG },
    caption: text
  }, { quoted: mek });

  delete pendingMenu[sender];
});
