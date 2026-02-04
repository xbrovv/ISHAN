const { cmd } = require("../command");
const fetch = require("node-fetch");

const FOOTER = `\n\n> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏`;

cmd(
  {
    pattern: "instagram",
    alias: ["ig"],
    desc: "Download Instagram video",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("📸 *Instagram link send කරන්න*" + FOOTER);

      await reply("🔎 *𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶 𝙸𝙽𝚂𝚃𝙰𝙶𝚁𝙰𝙼 𝚅𝙸𝙳𝙴𝙾* ⏳");

      const res = await fetch(
        `https://new-api-site-fawn.vercel.app/api/download/instagram?apikey=darknero&url=${encodeURIComponent(
          q
        )}`
      );
      const data = await res.json();

      if (!data?.result?.url)
        return reply("❌ *No result Please try again*" + FOOTER);

      const caption =
        `*┎━━━━━━━━━━━━━━━━❖●►*\n` +
        `*┃➤ 📸 Platform :* Instagram\n` +
        `*┃➤ 👤 Author   :* ${data.result.author || "Unknown"}\n` +
        `*┃➤ ⏱ Type     :* ${data.result.type || "Video"}\n` +
        `*┗━━━━━━━━━━━━━━━━❖●►*\n\n\n` +
        `╭━━━━━━━❖✦►\n` +
        `┃➤ 🔮 𝗥𝗘𝗣𝗟𝗬 1️⃣ 𝗧𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 📸\n` +
        `╰━━━━━━━❖✦►` +
        FOOTER;

      const sentMsg = await bot.sendMessage(
        from,
        {
          image: {
            url:
              data.result.thumbnail ||
              "https://i.imgur.com/9QfY2Yp.jpg",
          },
          caption,
        },
        { quoted: mek }
      );

      await bot.sendMessage(from, {
        react: { text: "📸", key: sentMsg.key },
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
              video: { url: data.result.url },
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
      console.log("INSTAGRAM ERROR:", e);
      reply("⚠️ *Instagram download failed, please try again*" + FOOTER);
    }
  }
);
