const { cmd } = require("../command");
const { ytmp3 } = require("sadaslk-dlcore");
const yts = require("yt-search");

const FOOTER = `\n\n> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏`;

/* -------------------- YOUTUBE SEARCH -------------------- */
async function getYoutube(query) {
  const isUrl = /(youtube.com|youtu.be)/i.test(query);
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

/* ==================== SONG / MP3 ==================== */
cmd({
  pattern: "song",
  alias: ["Play", "mp3","Audio"],
  desc: "Download YouTube song (MP3)",
  category: "download",
  filename: __filename,
}, async (bot, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("🎧 *song name or link send*" + FOOTER);

    await reply("🔎 *𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶  𝚈𝙾𝚄𝚁 𝚂𝙾𝙽𝙶*");

    const video = await getYoutube(q);
    if (!video)
      return reply("❌ *No result Please try again*" + FOOTER);

    // Show video info with only "1. Audio" instruction
    const caption =
  `*┎━━━━━━━━━━━━━━━━❖●►*\n` +
  `*┃➤ 🎧 Title    :* ${video.title}\n` +
  `*┃➤ 💃 Channel  :* ${video.author?.name || "Unknown"}\n` +
  `*┃➤ ⏱ Duration :* ${video.timestamp}\n` +
  `*┃➤ 👀 Views    :* ${video.views.toLocaleString()}\n` +
  `*┃➤ 🔗 Link     :* ${video.url}\n` +
  `*┗━━━━━━━━━━━━━━━━❖●►*\n\n\n` +   // 👈 මෙතන හිස් තැන
  `╭━━━━━━━❖✦►
┃➤ 🔮 𝗥𝗘𝗣𝗟𝗬 ❶ 𝗧𝗢 𝗔𝗨𝗗𝗜𝗢 💃 
╰━━━━━━━❖✦►` +
  FOOTER;

    const sentMsg = await bot.sendMessage(
      from,
      { image: { url: video.thumbnail }, caption },
      { quoted: mek }
    );

    await bot.sendMessage(from, { react: { text: "🎧", key: sentMsg.key } });

    const messageID = sentMsg.key.id;

    // Listen for reply
    const listener = async (update) => {
      try {
        const mekInfo = update?.messages[0];
        if (!mekInfo?.message) return;

        const messageType =
          mekInfo?.message?.conversation ||
          mekInfo?.message?.extendedTextMessage?.text;

        const isReplyToSentMsg =
          mekInfo?.message?.extendedTextMessage?.contextInfo?.stanzaId ===
          messageID;

        if (!isReplyToSentMsg) return;

        const userReply = messageType.trim();

        if (userReply !== "1") return; // only process if "1" is replied

        const processMsg = await bot.sendMessage(from, { text: "*𝙻𝙾𝙰𝙳𝙸𝙽𝙶...*" }, { quoted: mek });
        const data = await ytmp3(video.url);
        if (!data?.url) return reply("❌ *Song download failed, please try again*" + FOOTER);

        // Send Audio
        await bot.sendMessage(
          from,
          { audio: { url: data.url }, mimetype: "audio/mpeg" },
          { quoted: mek }
        );

        await bot.sendMessage(from, { text: "𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘𝗗 ✅", edit: processMsg.key });

        // Remove listener after first valid reply
        bot.ev.off("messages.upsert", listener);

      } catch (err) {
        console.error(err);
        reply(`❌ *An error occurred while processing:* ${err.message || "Error!"}`);
        bot.ev.off("messages.upsert", listener);
      }
    };

    bot.ev.on("messages.upsert", listener);

  } catch (e) {
    console.log("SONG ERROR:", e);
    reply("⚠️ *Song download failed, please try again*" + FOOTER);
  }
});
