/**
 * ishan spark-x 🚀 – Configuration File
 * User Editable Area (Core Safe)
 * Only this file users are allowed to edit
 */

module.exports = {

  // 🔐 WhatsApp Session ID (MEGA or base64)
  SESSION_ID: process.env.SESSION_ID || "78RnjDSK#fwgewvE5wHyFUzUmqQs5XLmoL-cQbQ-yHgoUPgIzujI",


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
  AUTO_STATUS_REACT: false,
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
𝗜𝗦𝗛𝗔𝗡 𝗦𝗣𝗔𝗥𝗞-𝕏 🚀
◄✦✦━━━━━━━━━━━━━━━━━━━━━━✦✦►
🟢 BOT STATUS : ONLINE & ACTIVE ✨

⚡ Fast • Stable • Powerful
🔌 Advanced Plugin-Based WhatsApp Bot
🚀 Built for performance, reliability & automation

◄✦✦━━━━━━━━━━━━━━━━━━━━━━✦✦►
🧬 LIVE SYSTEM STATS

🕒 Time      : {TIME}
⏱️ Uptime    : {UPTIME}
📟 RAM Usage : {RAM}

◄✦✦━━━━━━━━━━━━━━━━━━━━━━✦✦►
🛡️ Security  : Session Verified
📡 Connection: WhatsApp Multi-Device
⚙️ Mode      : {MODE}

◄✦✦━━━━━━━━━━━━━━━━━━━━━━✦✦►
> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏
`
};
