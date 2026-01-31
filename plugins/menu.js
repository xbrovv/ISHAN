const { cmd, commands } = require("../command");

const pendingMenu = {};
const numberEmojis = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];

const HEADER_IMG = "https://files.catbox.moe/h1xuqv.jpg";

const FOOTER = `
◄✦✦━━━━━━━━━━━━━━━━━━━━━━✦✦►
© 2025 ISHAN MD
◄✦✦━━━━━━━━━━━━━━━━━━━━━━✦✦►
`;

cmd({
  pattern: "menu",
  react: "📜",
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

  let text = `
👋 Hello, ${pushname}

🧿 *WELCOME TO ISHAN-SPARK-X MD* 🧿

╭─「 STATUS DETAILS 」
│ 👤 Owner : Ishan
│ ☎ Owner Number : 94761638379
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

  const category = data.categories[index];
  const cmds = data.commandMap[category];

  let text = `
🎀 ＝ ${category} COMMAND LIST ＝ 🎀
`;

  cmds.forEach(c => {
    const name = `.${c.pattern}`;
    text += `
╭──────────────────────
✈ Command : ${c.pattern}
✈ Use : ${name} ${c.use || "<Query>"}
╰──────────────────────
`;
  });

  text += `\n${FOOTER}`;

  await ishan.sendMessage(from, {
    image: { url: HEADER_IMG },
    caption: text
  }, { quoted: mek });

  delete pendingMenu[sender];
});
