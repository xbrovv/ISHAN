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
  alias: ["ytmp3", "mp3"],
  desc: "Download YouTube song (MP3)",
  category: "download",
  filename: __filename,
}, async (bot, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("🎧 *Song name* හෝ *YouTube link* එකක් දාන්න 😊" + FOOTER);

    await reply("🔎 *YouTube එකේ search වෙනවා… පොඩ්ඩක් wait කරන්න* ⏳");

    const video = await getYoutube(q);
    if (!video)
      return reply("❌ *Result එකක් හම්බුනේ නෑ* 😔 වෙන එකක් try කරන්න." + FOOTER);

    // Show video info with only "1. Audio" instruction
    const caption =
  `*┎━━━━━━━━━━━━━━━━❖*\n` +
  `*┃➤ 🎵 Title    :* ${video.title}\n` +
  `*┃➤ 👤 Channel  :* ${video.author?.name || "Unknown"}\n` +
  `*┃➤ ⏱ Duration :* ${video.timestamp}\n` +
  `*┃➤ 👀 Views    :* ${video.views.toLocaleString()}\n` +
  `*┃➤ 🔗 Link     :* ${video.url}\n` +
  `*┃➤ 🔽 Reply 1 to download Audio*\n` +
  `*┗━━━━━━━━━━━━━━━━❖*` +
  FOOTER;

    const sentMsg = await bot.sendMessage(
      from,
      { image: { url: video.thumbnail }, caption },
      { quoted: mek }
    );

    await bot.sendMessage(from, { react: { text: "🎶", key: sentMsg.key } });

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

        const processMsg = await bot.sendMessage(from, { text: "⏳ Processing..." }, { quoted: mek });
        const data = await ytmp3(video.url);
        if (!data?.url) return reply("❌ MP3 download fail උනා 😕 නැවත try කරන්න." + FOOTER);

        // Send Audio
        await bot.sendMessage(
          from,
          { audio: { url: data.url }, mimetype: "audio/mpeg" },
          { quoted: mek }
        );

        await bot.sendMessage(from, { text: "✅ Media Upload Successful ✅", edit: processMsg.key });

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
    reply("⚠️ *Song download එකේ error එකක් ආවා* 😢 පස්සේ try කරන්න." + FOOTER);
  }
});
