const { cmd } = require("../command");
const { ytmp3 } = require("sadaslk-dlcore");
const yts = require("yt-search");

/*
  🚀 ISHAN SPARK-X – YouTube Song Downloader
  🔒 Owner base compatible
  ⚙️ Core system unchanged
  ✨ UI / messages only enhanced (Unicode + Emoji)
*/

const FOOTER = `\n\n> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏`;

/* -------------------- YOUTUBE SEARCH -------------------- */
async function getYoutube(query) {
  const isUrl = /(youtube\.com|youtu\.be)/i.test(query);
  if (isUrl) {
    const id = query.split("v=")[1] || query.split("/").pop();
    return await yts({ videoId: id });
  }

  const search = await yts(query);
  if (!search.videos || !search.videos.length) return null;
  return search.videos[0];
}

/* ==================== SONG / MP3 ==================== */
cmd(
  {
    pattern: "song",
    alias: ["ytmp3", "mp3"],
    desc: "Download YouTube song (MP3)",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q)
        return reply(
          "🎧 *Song name* හෝ *YouTube link* එකක් දාන්න 😊" + FOOTER
        );

      await reply("🔎 *YouTube එකේ search වෙනවා… පොඩ්ඩක් wait කරන්න* ⏳");

      const video = await getYoutube(q);
      if (!video)
        return reply(
          "❌ *Result එකක් හම්බුනේ නෑ* 😔 වෙන එකක් try කරන්න." +
            FOOTER
        );

      const caption =
        `🎵 *${video.title}*\n\n` +
        `👤 Channel : ${video.author?.name || "Unknown"}\n` +
        `⏱ Duration : ${video.timestamp}\n` +
        `👀 Views    : ${video.views.toLocaleString()}\n` +
        `🔗 ${video.url}` +
        FOOTER;

      await bot.sendMessage(
        from,
        { image: { url: video.thumbnail }, caption },
        { quoted: mek }
      );

      await reply("⬇️ *MP3 download වෙනවා…* 🎶 Poddak wait karanna");

      const data = await ytmp3(video.url);
      if (!data?.url)
        return reply(
          "❌ *MP3 download fail උනා* 😕 නැවත try කරන්න." + FOOTER
        );

      await bot.sendMessage(
        from,
        { audio: { url: data.url }, mimetype: "audio/mpeg" },
        { quoted: mek }
      );
    } catch (e) {
      console.log("SONG ERROR:", e);
      reply(
        "⚠️ *Song download එකේ error එකක් ආවා* 😢 පස්සේ try කරන්න." +
          FOOTER
      );
    }
  }
);
