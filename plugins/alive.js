const { cmd } = require("../command"); // ඔයාගේ bot command handler
const os = require("os");
const moment = require("moment"); // Uptime / Time handle කරන්න

// Bot Alive Command
cmd({
  pattern: "alive",
  react: "👋",
  async handler(m, conn) {

    // Bot Uptime calculation
    const uptime = process.uptime(); // seconds
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const UPTIME = `${hours}h ${minutes}m ${seconds}s`;

    // Current Time
    const TIME = moment().format("HH:mm:ss");

    // RAM usage
    const RAM = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;

    // Alive Message
    const aliveMessage = `👋 𝐇𝐈, *WΞLCΩMΞ TΩ USΞR* 𝐈❜𝐌 𝐀𝐋𝐈𝐕𝐄 𝐍𝐎𝐖 👾

*╭─「 ᴅᴀᴛᴇ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ 」*
*┃* 🧑‍💻 *\`Owner\`* : *ɪsʜᴀɴ ᴍᴀᴅᴜsᴀɴᴋᴇ*
*┃* ⏰ *\`Time\`* : ${TIME}
*╰─────────────●●►*

*╭─「 ꜱᴛᴀᴛᴜꜱ ᴅᴇᴛᴀɪʟꜱ 」*
*┃* 👩‍💼 *\`User\`* : *${m.pushName || "User"}*
*┃* ✒️ *\`Prefix\`* : *(.)*
*┃* 🧬 *\`Version\`* : *ᴠ3.0 ᴜʟᴛʀᴀ*
*┃* 🖥️ *\`Platform\`* : *ʟɪɴᴜx*
*┃* 📡 *\`Host\`* : *ɪꜱʜᴀɴ-x ᴠᴘꜱ*
*┃* 📟 *\`Uptime\`* : ${UPTIME}
*┃* 📂 *\`Memory\`* : ${RAM}
*╰─────────────●●►*

*╭─「 ɪꜱʜᴀɴ-x ᴍᴅ ᴜᴘᴅᴀᴛᴇ & ᴅᴇᴘʟᴏʏ 」*
*╰──────────●●►*

> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏
`;

    // Buttons (View Channel using URL)
    const buttons = [
      {
        urlButton: {
          displayText: "📺 View Channel",
          url: "https://chat.whatsapp.com/invite/120363424336206242@newsletter"
        }
      }
    ];

    // Send Alive Message with Button
    await conn.sendMessage(m.chat, {
      text: aliveMessage,
      footer: "© 2026 ISHAN-X MD",
      templateButtons: buttons,
      headerType: 1
    });
  }
});
