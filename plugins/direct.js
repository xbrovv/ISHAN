const { cmd } = require("../command");
const axios = require("axios");
const path = require("path");

const FOOTER = "\n\n> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏";
const MAX_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

cmd(
  {
    pattern: "direct",
    alias: ["downurl", "file"],
    desc: "Direct file downloader (Reply 1 to confirm)",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q)
        return reply("📥 *Direct file link send*" + FOOTER);

      if (!q.startsWith("http"))
        return reply("❌ *Valid direct link send*" + FOOTER);

      await reply("🔎 *CHECKING YOUR FILE...*");

      const head = await axios.head(q).catch(() => null);

      let fileName = "downloaded_file";
      let mimeType = "application/octet-stream";
      let fileSize = "Unknown";
      let bytes = 0;

      if (head && head.headers) {
        mimeType = head.headers["content-type"] || mimeType;

        if (head.headers["content-length"]) {
          bytes = parseInt(head.headers["content-length"]);
          const mb = bytes / 1024 / 1024;
          fileSize = mb.toFixed(2) + " MB";
        }

        if (head.headers["content-disposition"]) {
          const match = head.headers["content-disposition"].match(/filename="?(.+)"?/);
          if (match) fileName = match[1];
        } else {
          fileName = path.basename(q.split("?")[0]);
        }
      }

      if (bytes > MAX_SIZE) {
        const gb = (bytes / 1024 / 1024 / 1024).toFixed(2);
        return reply(
          "🚫 *FILE TOO LARGE!*\n\n" +
          `📄 File : ${fileName}\n` +
          `📦 Size : ${gb} GB\n\n` +
          "⚠️ WhatsApp limit ~2GB.\n" +
          "මේ file එක send කරන්න බැහැ." +
          FOOTER
        );
      }

      const caption =
`*┎━━━━━━━━━━━━━━━━❖●►*
*┃➤ 📄 File Name :* ${fileName}
*┃➤ 📦 Size      :* ${fileSize}
*┃➤ 🧬 Type      :* ${mimeType}
*┗━━━━━━━━━━━━━━━━❖●►*

╭━━━━━━━❖✦►
┃➤ 𝗥𝗘𝗣𝗟𝗬 1️⃣ 𝗧𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 📥
╰━━━━━━━❖✦►`
+ FOOTER;

      const sentMsg = await bot.sendMessage(
        from,
        {
          image: {
            url: "https://files.catbox.moe/h1xuqv.jpg"
          },
          caption
        },
        { quoted: mek }
      );

      await bot.sendMessage(from, {
        react: { text: "📥", key: sentMsg.key }
      });

      const messageID = sentMsg.key.id;

      /* -------- LISTENER -------- */
      const listener = async (update) => {
        try {
          const mekInfo = update?.messages[0];
          if (!mekInfo?.message) return;

          const text =
            mekInfo.message.conversation ||
            mekInfo.message.extendedTextMessage?.text;

          const isReply =
            mekInfo.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

          if (!isReply) return;
          if (text.trim() !== "1") return;

          const loadingMsg = await bot.sendMessage(
            from,
            { text: "*𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙸𝙽𝙶...*" },
            { quoted: mek }
          );

          await bot.sendMessage(
            from,
            {
              document: { url: q },
              fileName: fileName,
              mimetype: mimeType,
            },
            { quoted: mek }
          );

          await bot.sendMessage(from, {
            text: "𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘𝗗 ✅",
            edit: loadingMsg.key,
          });

          bot.ev.off("messages.upsert", listener);

        } catch (err) {
          console.error(err);
          bot.ev.off("messages.upsert", listener);
          reply("❌ *Error occurred while downloading*" + FOOTER);
        }
      };

      bot.ev.on("messages.upsert", listener);

    } catch (e) {
      console.log("DOWNLOAD ERROR:", e);
      reply("⚠️ *Download failed, try another link*" + FOOTER);
    }
  }
);
