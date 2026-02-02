const { cmd } = require("../command");
const { ytmp3 } = require("sadaslk-dlcore");
const yts = require("yt-search");

/*
  🚀 ISHAN SPARK-X – YouTube Song Downloader
  🔒 Owner base compatible
  ⚙️ Core system unchanged
  ✨ UI / messages enhanced
*/

const FOOTER = `\n\n> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏`;

/* -------------------- YOUTUBE SEARCH -------------------- */
async function getYoutube(query) {
  const isUrl = /(youtube\.com|youtu\.be)/i.test(query);
  if (isUrl) {
    const id = query.includes("v=") ? query.split("v=")[1].split("&")[0] : query.split("/").pop();
    const result = await yts({ videoId: id });
    return result.videos?.[0] || null;
  }

  const search = await yts(query);
  return search.videos?.[0] || null;
}

/* ==================== SONG / MP3 ==================== */
cmd(
  {
    pattern: "song",
    alias: ["ytmp3", "mp3", "play"],
    desc: "Download YouTube song as MP3",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("🎧 *Song name* හෝ *YouTube link* එකක් දාන්න 😊" + FOOTER);

      await reply("🔎 *Searching YouTube… please wait* ⏳");

      const video = await getYoutube(q);
      if (!video) return reply("❌ *No results found!* 😔 Try something else." + FOOTER);

      const caption =
        `🎵 *${video.title}*\n\n` +
        `👤 Channel: ${video.author?.name || "Unknown"}\n` +
        `⏱ Duration: ${video.timestamp}\n` +
        `👀 Views: ${video.views?.toLocaleString() || "Unknown"}\n` +
        `🔗 ${video.url}` +
        FOOTER;

      // Send video thumbnail + info
      await bot.sendMessage(from, { image: { url: video.thumbnail }, caption }, { quoted: mek });

      // Processing message
      await reply("⬇️ *Downloading MP3…* 🎶 Please wait");

      const data = await ytmp3(video.url);
      if (!data?.url) return reply("❌ *MP3 download failed!* 😕 Try again." + FOOTER);

      // Send audio
      await bot.sendMessage(
        from,
        { audio: { url: data.url }, mimetype: "audio/mpeg" },
        { quoted: mek }
      );

      await reply("✅ *MP3 Download Successful!* 🎶" + FOOTER);
    } catch (e) {
      console.error("SONG ERROR:", e);
      reply("⚠️ *An error occurred while downloading the song!* 😢 Try again later." + FOOTER);
    }
  }
);
