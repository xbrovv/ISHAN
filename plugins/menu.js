
const { cmd } = require("../command");

const pendingMenu = {};

const HEADER_IMG = "https://files.catbox.moe/h1xuqv.jpg";

const FOOTER = `
◄✦✦━━━━━━━━━━━━━━━━━━━━━━✦✦►
> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏
◄✦✦━━━━━━━━━━━━━━━━━━━━━━✦✦►
`;

cmd({
  pattern: "menu",
  react: "📜",
  desc: "Show main menu",
  category: "main",
  filename: __filename
}, async (ishan, mek, m, { from, pushname }) => {

  const time = new Date().toLocaleTimeString();
  const date = new Date().toLocaleDateString();

  const menuText = `👋 *Hello, ${pushname}*
*🫟 Wᴇʟᴄᴏᴍᴇ Tᴏ Qᴜᴇᴇɴ-ɴᴇᴛʜᴜ-Mᴅ 🫟*

*╭─「 ꜱᴛᴀᴛᴜꜱ ᴅᴇᴛᴀɪʟꜱ 」*
*│* 🤵 *\`Owner\`* : ${OWNER_NAME}
*│* 📞 *\`Owner Number\`* : ${OWNER_NUMBER}
*│* 🚀 *\`Prefix\`* : ${config.PREFIX}
*│* 🕒 *\`Time\`* : ${time}
*│* 📅 *\`Date\`* : ${date}
*│* 📋 *\`Categories\`* : 9
*╰──────────●●►*

*\`Reply Below Number 🔢\`*

│ ◦ *1* \`\`\`OWNER MENU\`\`\`
│ ◦ *2* \`\`\`AI MENU\`\`\`
│ ◦ *3* \`\`\`SEARCH MENU\`\`\`
│ ◦ *4* \`\`\`DOWNLOAD MENU\`\`\`
│ ◦ *5* \`\`\`MAIN MENU\`\`\`
│ ◦ *6* \`\`\`CONVERT MENU\`\`\`
│ ◦ *7* \`\`\`OTHER MENU\`\`\`
│ ◦ *8* \`\`\`LOGO MENU\`\`\`
│ ◦ *9* \`\`\`GROUP MENU\`\`\`

${FOOTER}`;

  await ishan.sendMessage(from, {
    image: { url: HEADER_IMG },
    caption: menuText
  }, { quoted: mek });

  pendingMenu[m.sender] = { step: "main" };
});
