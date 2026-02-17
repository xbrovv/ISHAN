const { cmd } = require("../command");
const os = require("os");

cmd({
  pattern: "developer",
  alias: ["dev", "owner"],
  desc: "Show bot developer information",
  category: "main",
  react: "👑",
  filename: __filename,
  fromMe: false,
}, async (ishan, mek, m, { reply }) => {

  const ownerName = "𝐈𝐒𝐇𝐀𝐍-𝐗 𝐌𝐃";
  const ownerNumber = "94761638379";
  const github = "https://github.com";
  const image = "https://files.catbox.moe/h1xuqv.jpg";

  const runtime = process.uptime();
  const hours = Math.floor(runtime / 3600);
  const minutes = Math.floor((runtime % 3600) / 60);
  const seconds = Math.floor(runtime % 60);

  const caption = `
╭━━━〔 👑 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 〕
┃
┃➤ 🧑‍💻 *Owner*   : ${ownerName}
┃➤ 📱 *Number*  : wa.me/${ownerNumber}
┃➤ 🌐 *GitHub*  : ${github}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 🤖 𝐁𝐎𝐓 𝐃𝐄𝐓𝐀𝐈𝐋𝐒 〕━━━╮
┃➤ ⚡ *Name*      : ISHAN-X MD
┃➤ 🛠 *Version*   : V3.0  ULTRA
┃➤ 💻 *Platform*  : ${os.platform()}
┃➤ ⏳ *Uptime*    : ${hours}h ${minutes}m ${seconds}s
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 📦 𝐏𝐑𝐎𝐉𝐄𝐂𝐓𝐒 〕━━━╮
┃❖ *ISHAN-X MD*    
╰━━━━━━━━━━━━━━━━━━━━

> 🚀 Powered by ISHAN-X MD
> 👑 Developed with Passion
`.trim();

  await ishan.sendMessage(
    mek.key.remoteJid,
    {
      image: { url: image },
      caption
    },
    { quoted: mek }
  );
});
