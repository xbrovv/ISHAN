const { cmd } = require("../command");
const { tiktok } = require("sadaslk-dlcore");

const FOOTER = `\n\n> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏`;

cmd(
  {
    pattern: "tiktok",
    alias: ["tt"],
    desc: "Download TikTok video (No Watermark)",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("📱 *Send your TikTok Video link*" + FOOTER);

      await reply("🔎 *𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶 𝚃𝙸𝙺𝚃𝙾𝙺 𝚅𝙸𝙳𝙴𝙾*");

      const data = await tiktok(q);
      if (!data?.no_watermark)
        return reply("❌ *No result Please try again*" + FOOTER);

      const caption =
        `*┎━━━━━━━━━━━━━━━━❖●►*\n` +
        `*┃➤ 📱 Title    :* ${data.title || "TikTok Video"}\n` +
        `*┃➤ 💃 Author   :* ${data.author || "Unknown"}\n` +
        `*┃➤ ⏱ Duration :* ${data.runtime || "?"}s\n` +
        `*┗━━━━━━━━━━━━━━━━❖●►*\n\n\n` +
        `╭━━━━━━━❖✦►\n` +
        `┃➤ 🔮 𝗥𝗘𝗣𝗟𝗬 1️⃣ 𝗧𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 💃\n` +
        `╰━━━━━━━❖✦►` +
        FOOTER;

      const sentMsg = await bot.sendMessage(
        from,
        {
          image: { url: data.thumbnail || "https://files.catbox.moe/h1xuqv.jpg" },
          caption,
        },
        { quoted: mek }
      );

      await bot.sendMessage(from, {
        react: { text: "📱", key: sentMsg.key },
      });

      const messageID = sentMsg.key.id;

      // 🔁 Reply Listener
      const listener = async (update) => {
        try {
          const mekInfo = update?.messages[0];
          if (!mekInfo?.message) return;

          const text =
            mekInfo.message.conversation ||
            mekInfo.message.extendedTextMessage?.text;

          const isReply =
            mekInfo.message.extendedTextMessage?.contextInfo?.stanzaId ===
            messageID;

          if (!isReply || text?.trim() !== "1") return;

          const processMsg = await bot.sendMessage(
            from,
            { text: "*𝙻𝙾𝙰𝙳𝙸𝙽𝙶...*" },
            { quoted: mek }
          );

          await bot.sendMessage(
            from,
            {
              video: { url: data.no_watermark },
              mimetype: "video/mp4",
            },
            { quoted: mek }
          );

          await bot.sendMessage(from, {
            text: "𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘𝗗 ✅",
            edit: processMsg.key,
          });

          bot.ev.off("messages.upsert", listener);
        } catch (err) {
          console.error(err);
          reply("❌ *Error occurred while downloading*" + FOOTER);
          bot.ev.off("messages.upsert", listener);
        }
      };

      bot.ev.on("messages.upsert", listener);
    } catch (e) {
      console.log("TIKTOK ERROR:", e);
      reply("⚠️ *TikTok download failed, please try again*" + FOOTER);
    }
  }
);
