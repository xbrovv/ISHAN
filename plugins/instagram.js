const { cmd } = require("../command");
const { igdl } = require("ruhend-scraper");

const FOOTER = `\n\n> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏`;

/* ==================== INSTAGRAM DOWNLOAD ==================== */
cmd({
  pattern: "Instagram",
  alias: ["ig", "igdl"],
  desc: "Download Instagram Video/Reel",
  category: "download",
  filename: __filename,
}, async (bot, mek, m, { from, q, reply }) => {
  try {
    if (!q)
      return reply("📸 *Instagram link එකක් එවන්න*" + FOOTER);

    if (!q.includes("instagram.com"))
      return reply("❌ *Valid Instagram link එකක් දෙන්න*" + FOOTER);

    await reply("🔎 *𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶  𝚈𝙾𝚄𝚁 𝙼𝙴𝙳𝙸𝙰*");

    const data = await igdl(q);

    if (!data || !data[0]?.url)
      return reply("❌ *No result Please try again*" + FOOTER);

    const firstMedia = data[0];

    const caption =
`*┎━━━━━━━━━━━━━━━━❖●►*
*┃➤ 📸 Platform  :* Instagram
*┃➤ 📦 Media Type:* ${firstMedia.type}
*┃➤ 🔗 Link      :* ${q}
*┗━━━━━━━━━━━━━━━━❖●►*

╭━━━━━━━❖✦►
┃➤ 𝗥𝗘𝗣𝗟𝗬 1️⃣ 𝗧𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 📥
╰━━━━━━━❖✦►`
+ FOOTER;

    const sentMsg = await bot.sendMessage(
      from,
      { image: { url: firstMedia.thumbnail || firstMedia.url }, caption },
      { quoted: mek }
    );

    await bot.sendMessage(from, {
      react: { text: "📸", key: sentMsg.key }
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
          mekInfo.message.extendedTextMessage?.contextInfo?.stanzaId ===
          messageID;

        if (!isReply) return;
        if (text.trim() !== "1") return;

        const loadingMsg = await bot.sendMessage(
          from,
          { text: "*𝙻𝙾𝙰𝙳𝙸𝙽𝙶...*" },
          { quoted: mek }
        );

        for (let media of data) {
          if (media.type === "video") {
            await bot.sendMessage(
              from,
              {
                video: { url: media.url },
                mimetype: "video/mp4",
                fileName: "instagram_video.mp4",
              },
              { quoted: mek }
            );
          } else if (media.type === "image") {
            await bot.sendMessage(
              from,
              {
                image: { url: media.url },
              },
              { quoted: mek }
            );
          }
        }

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
    console.log("IG DOWNLOAD ERROR:", e);
    reply("⚠️ *Download failed, try again*" + FOOTER);
  }
});
