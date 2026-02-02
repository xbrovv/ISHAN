const { cmd } = require("../command");
const os = require("os");
const config = require("../config");
const { ALIVE_MSG, ALIVE_IMG } = config;

cmd(
  {
    pattern: "alive",
    desc: "Check bot status",
    category: "main",
    react: "✨",
    filename: __filename,
  },
  async (ishan, mek, m, { from, reply }) => {
    try {
      // React when command used
      await ishan.sendMessage(from, {
        react: { text: "✨", key: mek.key }
      });

      /* ───────────── TIME ───────────── */
      const now = new Date();
      const time = now.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Colombo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      /* ───────────── UPTIME ───────────── */
      const uptimeSec = process.uptime();
      const hrs = Math.floor(uptimeSec / 3600);
      const mins = Math.floor((uptimeSec % 3600) / 60);
      const secs = Math.floor(uptimeSec % 60);
      const uptime = `${hrs}h ${mins}m ${secs}s`;

      /* ───────────── RAM ───────────── */
      const used = process.memoryUsage().rss / 1024 / 1024;
      const total = os.totalmem() / 1024 / 1024;
      const ram = `${used.toFixed(1)}MB / ${total.toFixed(0)}MB`;

      /* ───────────── BOT DETAILS ───────────── */
      const botNumber = ishan.user.id.split(":")[0];
      const platform = os.platform();
      const mode = (config.MODE || "public").toUpperCase();

      /* ───────────── MESSAGE BUILD ───────────── */
      let aliveText = ALIVE_MSG
        .replace("{TIME}", time)
        .replace("{UPTIME}", uptime)
        .replace("{RAM}", ram)
        .replace("{MODE}", mode);

      // Extra dynamic panel
      aliveText += `
      👋 𝐇𝐈, *WΞLCΩMΞ TΩ USΞR* 𝐈❜𝐀𝐌 𝐀𝐋𝐈𝐕𝐄 𝐍𝐎𝐖 👾

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
`;

      /* ───────────── SEND ───────────── */
      if (ALIVE_IMG) {
        await ishan.sendMessage(
          from,
          {
            image: { url: ALIVE_IMG },
            caption: aliveText,
          },
          { quoted: mek }
        );
      } else {
        await reply(aliveText);
      }
    } catch (e) {
      console.error("Alive Error:", e);
      reply("❌ Alive status unavailable right now.");
    }
  }
);
