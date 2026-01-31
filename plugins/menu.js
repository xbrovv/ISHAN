const { cmd, commands } = require("../command");
const os = require("os");
const config = require("../config");

const pendingMenu = {};
const numberEmojis = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];

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

  // CATEGORY MAP
  const commandMap = {
    OWNER: [],
    AI: [],
    SEARCH: [],
    DOWNLOAD: [],
    MAIN: [],
    CONVERT: [],
    OTHER: [],
    LOGO: [],
    GROUP: []
  };

  for (const c of commands) {
    if (c.dontAddCommandList) continue;
    const cat = (c.category || "other").toUpperCase();
    if (commandMap[cat]) commandMap[cat].push(c);
  }

  const categories = Object.keys(commandMap);

  // SYSTEM INFO
  const usedRam = process.memoryUsage().heapUsed;
  const totalRam = os.totalmem();

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

*Reply Below Number 🔢*

│ ◦ *1* \`\`\`OWNER MENU\`\`\`
│ ◦ *2* \`\`\`AI MENU\`\`\`
│ ◦ *3* \`\`\`SEARCH MENU\`\`\`
│ ◦ *4* \`\`\`DOWNLOAD MENU\`\`\`
│ ◦ *5* \`\`\`MAIN MENU\`\`\`
│ ◦ *6* \`\`\`CONVERT MENU\`\`\`
│ ◦ *7* \`\`\`OTHER MENU\`\`\`
│ ◦ *8* \`\`\`LOGO MENU\`\`\`
│ ◦ *9* \`\`\`GROUP MENU\`\`\`

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
