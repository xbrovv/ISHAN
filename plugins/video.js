const { cmd } = require("../command");
const { ytmp4 } = require("sadaslk-dlcore");
const yts = require("yt-search");

const FOOTER = `\n\n> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏`;

/* -------- YOUTUBE SEARCH -------- */
async function getYoutube(query) {
  const isUrl = /(youtube\.com|youtu\.be)/i.test(query);
  if (isUrl) {
    const id = query.includes("v=")
      ? query.split("v=")[1].split("&")[0]
      : query.split("/").pop();
    const result = await yts({ videoId: id });
    return result?.videos ? result.videos[0] : null;
  }
  const search = await yts(query);
  return search.videos && search.videos.length ? search.videos[0] : null;
}

/* ==================== VIDEO / MP4 ==================== */
cmd({
  pattern: "video",
  alias: ["ytmp4", "mp4"],
  desc: "Download YouTube video (MP4)",
  category: "download",
  filename: __filename,
}, async (bot, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("🎬 *video name or link send*" + FOOTER);

    await reply("🔎 *𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶  𝚈𝙾𝚄𝚁 𝚅𝙸𝙳𝙴𝙾*");

    const video = await getYoutube(q);
    if (!video)
      return reply("❌ *No result Please try again*" + FOOTER);

    const caption =
`*┎━━━━━━━━━━━━━━━━❖●►*
*┃➤ 🎬 Title    :* ${video.title}
*┃➤ 💃 Channel  :* ${video.author?.name || "Unknown"}
*┃➤ ⏱ Duration :* ${video.timestamp}
*┃➤ 👀 Views    :* ${video.views.toLocaleString()}
*┃➤ 🔗 Link     :* ${video.url}
*┗━━━━━━━━━━━━━━━━❖●►*

╭━━━━━━━❖✦►
┃➤ 𝗥𝗘𝗣𝗟𝗬 1️⃣ 𝗧𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 💃
╰━━━━━━━❖✦►`
+ FOOTER;

    const sentMsg = await bot.sendMessage(
      from,
      { image: { url: video.thumbnail }, caption },
      { quoted: mek }
    );

    await bot.sendMessage(from, {
      react: { text: "🎥", key: sentMsg.key }
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

        const data = await ytmp4(video.url, {
          format: "mp4",
          videoQuality: "720",
        });

        if (!data?.url)
          return reply("❌ *Video download failed*" + FOOTER);

        await bot.sendMessage(
          from,
          {
            video: { url: data.url },
            mimetype: "video/mp4",
            fileName: data.filename || "youtube_video.mp4",
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
    console.log("VIDEO ERROR:", e);
    reply("⚠️ *Video download failed, try again*" + FOOTER);
  }
});
