const { cmd } = require("../command");
const yts = require("yt-search");
const { ytmp3 } = require("sadaslk-dlcore");

const pendingSong = {};

cmd(
  {
    pattern: "song",
    react: "🎵",
    desc: "Download Song (Reply System)",
    category: "download",
    filename: __filename,
  },
  async (ishan, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ *Please provide a song name or YouTube link!*");

      const search = await yts(q);
      if (!search.videos.length) return reply("❌ *No results found!*");

      const data = search.videos[0];
      const url = data.url;

      let info = `🍄 *SONG DOWNLOADER* 🍄

🎵 *Title:* ${data.title}
⏳ *Duration:* ${data.timestamp}
👀 *Views:* ${data.views.toLocaleString()}
📅 *Uploaded:* ${data.ago}
👤 *Author:* ${data.author.name}

🔽 *Reply with your choice*
> 1️⃣  *Audio (MP3)* 🎧
`;

      const sent = await ishan.sendMessage(
        from,
        { image: { url: data.thumbnail }, caption: info },
        { quoted: mek }
      );

      pendingSong[from] = {
        videoUrl: url,
        msgId: sent.key.id,
        title: data.title,
        timestamp: data.timestamp,
      };

      await ishan.sendMessage(from, {
        react: { text: "🎶", key: sent.key }
      });

    } catch (e) {
      console.error(e);
      reply(`❌ *Error:* ${e.message}`);
    }
  }
);

// reply listener
cmd(
  { on: "text" },
  async (ishan, mek, m, { from, body, reply }) => {
    try {
      if (!pendingSong[from]) return;

      const pending = pendingSong[from];

      const isReply =
        mek.message?.extendedTextMessage?.contextInfo?.stanzaId ===
        pending.msgId;

      if (!isReply) return;

      if (body.trim() !== "1") {
        return reply("❌ *Invalid choice!* Reply with **1** 🎧");
      }

      // ✅ react to user's reply message
      await ishan.sendMessage(from, {
        react: { text: "✔️", key: mek.key }
      });

      // duration limit (30 min)
      let parts = pending.timestamp.split(":").map(Number);
      let seconds =
        parts.length === 3
          ? parts[0] * 3600 + parts[1] * 60 + parts[2]
          : parts[0] * 60 + parts[1];

      if (seconds > 1800) {
        delete pendingSong[from];
        return reply("⛔ *Audio longer than 30 minutes not supported!*");
      }

      const msg = await reply("⏳ *Downloading audio...*");

      const song = await ytmp3(pending.videoUrl, "192");
      if (!song?.download?.url) {
        delete pendingSong[from];
        return reply("❌ *Download failed!*");
      }

      await ishan.sendMessage(
        from,
        {
          audio: { url: song.download.url },
          mimetype: "audio/mpeg",
        },
        { quoted: mek }
      );

      await ishan.sendMessage(from, {
        text: "✅ *Audio Download Successful!* 🎶",
        edit: msg.key,
      });

      delete pendingSong[from];

    } catch (e) {
      console.error(e);
      reply(`❌ *Error:* ${e.message}`);
    }
  }
);
