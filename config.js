/**
 * ishan spark-x 🚀 – Configuration File
 * User Editable Area (Core Safe)
 * Only this file users are allowed to edit
 */

module.exports = {

  // 🔐 WhatsApp Session ID (MEGA or base64)
  SESSION_ID: process.env.SESSION_ID || "T4YkFIwb#-fRED-jUHMT3kFPJy4x65tMrO3Y8aohSapjCay62UNw",


  // ===============================
  // 🤖 BOT MODE SYSTEM
  // public  = groups + inbox
  // group   = groups only
  // inbox   = inbox only
  // private = owner + sudo only
  // ===============================
  MODE: process.env.MODE || "public",


  // ===============================
  // 📌 STATUS AUTOMATION SYSTEM
  // (DEFAULT: OFF)
  // ===============================
  AUTO_STATUS_SEEN: true,
  AUTO_STATUS_REACT: true,
  AUTO_STATUS_FORWARD: false,


  // ===============================
  // 🛡️ ANTI DELETE SYSTEM
  // (DEFAULT: OFF)
  // ===============================
  ANTI_DELETE: true,


  // ===============================
  // ⚙️ GENERAL SETTINGS
  // ===============================
  PREFIX: process.env.PREFIX || ".",


  // ===============================
  // 🖼️ BRANDING / UI
  // ===============================
  ALIVE_IMG:
    process.env.ALIVE_IMG ||
    "https://files.catbox.moe/h1xuqv.jpg",


  // Alive Message Template
// Used in alive.js plugin
ALIVE_MSG: `
👋 𝐇𝐈, {USER} 𝐈❜𝐀𝐌 𝐀𝐋𝐈𝐕𝐄 𝐍𝐎𝐖 👾

*╭─「  ᴅᴀᴛᴇ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ  」*
*┃* 📅 *\`Date\`* : {DATE}
*┃* ⏰ *\`Time\`* : {TIME}
*╰─────────────●●►*

*╭─「  ꜱᴛᴀᴛᴜꜱ ᴅᴇᴛᴀɪʟꜱ  」*
*┃* 👤 *\`User\`* : {USER}
*┃* ✒️ *\`Prefix\`* : {PREFIX}
*┃* 🧬 *\`Version\`* : {VERSION}
*┃* 🎈 *\`Platform\`* : Linux
*┃* 📡 *\`Host\`* : {HOST}
*┃* 📟 *\`Uptime\`* : {UPTIME}
*┃* 📂 *\`Memory\`* : {RAM}
*╰─────────────●●►*

*╭─「 ᴅᴇᴘʟᴏʏ ᴠɪᴅᴇᴏꜱ & ᴏᴛʜᴇʀ ɪɴꜰᴏ 」*
{EXTRA}
*╰──────────●●►*

> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏
`
};
