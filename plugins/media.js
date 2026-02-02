
const { cmd } = require("../command");
const { ytmp3 } = require("sadaslk-dlcore");
const yts = require("yt-search");

const FOOTER = `\n\n> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏`;

// YouTube search function
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

// ==================== SONG / MP3 with Button ====================
cmd(
  {
    pattern: "song",
    alias: ["ytmp3", "mp3", "play"],
    desc: "Download YouTube song as MP3 (Button style)",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply, conn }) => {
    try {
      if (!q) return reply("🎧 *Song name* හෝ *YouTube link* එකක් දාන්න 😊" + FOOTER);

      await reply("🔎 *Searching YouTube… please wait* ⏳");

      const video = await getYoutube(q);
      if (!video) return reply("❌ *No results found!* 😔 Try something else." + FOOTER);

      const info =
        `🎵 *${video.title}*\n\n` +
        `👤 Channel: ${video.author?.name || "Unknown"}\n` +
        `⏱ Duration: ${video.timestamp}\n` +
        `👀 Views: ${video.views?.toLocaleString() || "Unknown"}\n` +
        `🔗 ${video.url}` +
        FOOTER;

      // Buttons
      const buttons = [
        { buttonId: `download_audio_${video.url}`, buttonText: { displayText: "Download Audio 🎵" }, type: 1 }
      ];

      await bot.sendMessage(
        from,
        { image: { url: video.thumbnail }, caption: info, buttons, headerType: 4 },
        { quoted: mek }
      );
    } catch (e) {
      console.error("SONG ERROR:", e);
      reply("⚠️ *Error occurred!* 😢 Try again later." + FOOTER);
    }
  }
);

// ==================== BUTTON CLICK HANDLER ====================
conn.ev.on("messages.upsert", async (update) => {
  const msg = update?.messages?.[0];
  if (!msg?.message?.buttonsResponseMessage) return;

  const { selectedButtonId } = msg.message.buttonsResponseMessage;
  if (!selectedButtonId.startsWith("download_audio_")) return;

  const videoUrl = selectedButtonId.replace("download_audio_", "");
  const from = msg.key.remoteJid;
  const quoted = msg;

  try {
    const processingMsg = await conn.sendMessage(from, { text: "⏳ Processing download…" }, { quoted });

    const data = await ytmp3(videoUrl);
    if (!data?.url) return conn.sendMessage(from, { text: "❌ *MP3 download failed!* 😕 Try again." }, { quoted });

    await conn.sendMessage(from, { audio: { url: data.url }, mimetype: "audio/mpeg" }, { quoted });
    await conn.sendMessage(from, { text: "✅ *MP3 Download Successful!* 🎶", edit: processingMsg.key });
  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { text: "⚠️ *Error occurred while downloading song!* 😢" }, { quoted });
  }
});
