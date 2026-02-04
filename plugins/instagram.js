const { cmd } = require("../command");
import axios from "axios";
import crypto from "crypto";

const FOOTER = `\n\n> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏`;

/* -------------------- IG DOWNLOADER -------------------- */
async function igdl(url) {
  const key = Buffer.from("qwertyuioplkjhgf", "utf-8");

  const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
  cipher.setAutoPadding(true);
  let encrypted = cipher.update(url, "utf8", "hex");
  encrypted += cipher.final("hex");

  const res = await axios.get("https://api.videodropper.app/allinone", {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120",
      url: encrypted,
    },
  });

  return res.data;
}

/* ==================== INSTAGRAM ==================== */
cmd(
  {
    pattern: "instagram",
    alias: ["ig", "insta"],
    desc: "Download Instagram video / reel",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q)
        return reply("📸 *Instagram link send*" + FOOTER);

      const infoMsg = await reply(
        "🔎 *𝙵𝙴𝚃𝙲𝙷𝙸𝙽𝙶  𝙸𝙽𝚂𝚃𝙰𝙶𝚁𝙰𝙼  𝙿𝙾𝚂𝚃*"
      );

      const data = await igdl(q);
      if (!data?.status || !data?.data?.length)
        return reply("❌ *No media found, try again*" + FOOTER);

      const media = data.data[0];

      const caption =
        `*┎━━━━━━━━━━━━━━━━❖●►*\n` +
        `*┃➤ 📸 Platform :* Instagram\n` +
        `*┃➤ 🎞 Type     :* ${media.type || "Video"}\n` +
        `*┃➤ 🔗 Link     :* ${q}\n` +
        `*┗━━━━━━━━━━━━━━━━❖●►*\n\n\n` +
        `╭━━━━━━━❖✦►\n` +
        `┃➤ 🔮 𝗥𝗘𝗣𝗟𝗬 1️⃣ 𝗧𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 📥\n` +
        `╰━━━━━━━❖✦►` +
        FOOTER;

      const sentMsg = await bot.sendMessage(
        from,
        {
          image: { url: media.thumbnail || media.url },
          caption,
        },
        { quoted: mek }
      );

      await bot.sendMessage(from, {
        react: { text: "📸", key: sentMsg.key },
      });

      const messageID = sentMsg.key.id;

      /* -------- LISTENER -------- */
      const listener = async (update) => {
        try {
          const msg = update?.messages[0];
          if (!msg?.message) return;

          const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text;

          const isReply =
            msg.message.extendedTextMessage?.contextInfo?.stanzaId ===
            messageID;

          if (!isReply) return;
          if (text.trim() !== "1") return;

          const loading = await bot.sendMessage(
            from,
            { text: "*𝙻𝙾𝙰𝙳𝙸𝙽𝙶...*" },
            { quoted: mek }
          );

          await bot.sendMessage(
            from,
            {
              video: { url: media.url },
              mimetype: "video/mp4",
            },
            { quoted: mek }
          );

          await bot.sendMessage(from, {
            text: "𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘𝗗 ✅",
            edit: loading.key,
          });

          bot.ev.off("messages.upsert", listener);
        } catch (err) {
          console.error(err);
          bot.ev.off("messages.upsert", listener);
        }
      };

      bot.ev.on("messages.upsert", listener);
    } catch (e) {
      console.error("IG ERROR:", e);
      reply("⚠️ *Instagram download failed*" + FOOTER);
    }
  }
);
