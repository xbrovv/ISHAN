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
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ *Please provide a song name or YouTube link!*");

      const search = await yts(q);
      if (!search.videos.length) return reply("❌ *No results found!*");

      const data = search.videos[0];

      let info = `🍄 *SONG DOWNLOADER* 🍄

🎵 *Title:* ${data.title}
⏳ *Duration:* ${data.timestamp}
👀 *Views:* ${data.views.toLocaleString()}
📅 *Uploaded:* ${data.ago}
👤 *Author:* ${data.author.name}

🔽 *Reply with your choice*
> 1️⃣  *Audio (MP3)* 🎧
`;

      const sent = await conn.sendMessage(
        from,
        { image: { url: data.thumbnail }, caption: info },
        { quoted: mek }
      );

      pendingSong[from] = {
        url: data.url,
        msgId: sent.key.id,
        timestamp: data.timestamp,
        title: data.title,
      };

      await conn.sendMessage(from, {
        react: { text: "🎶", key: sent.key },
      });

      // 🔥 LISTENER (ONE TIME)
      conn.ev.on("messages.upsert", async (chatUpdate) => {
        try {
          const msg = chatUpdate.messages[0];
          if (!msg?.message) return;

          const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text;

          const isReply =
            msg.message.extendedTextMessage?.contextInfo?.stanzaId ===
            pendingSong[from]?.msgId;

          if (!isReply) return;

          if (text.trim() !== "1") {
            return reply("❌ *Invalid choice!* Reply with **1** 🎧");
          }

          // ✅ react to user's reply
          await conn.sendMessage(from, {
            react: { text: "✔️", key: msg.key },
          });

          // duration limit
          let parts = pendingSong[from].timestamp.split(":").map(Number);
          let seconds =
            parts.length === 3
              ? parts[0] * 3600 + parts[1] * 60 + parts[2]
              : parts[0] * 60 + parts[1];

          if (seconds > 1800) {
            delete pendingSong[from];
            return reply("⛔ *Audio longer than 30 minutes not supported!*");
          }

          const wait = await reply("⏳ *Downloading audio...*");

          const song = await ytmp3(pendingSong[from].url, "192");
          if (!song?.download?.url) {
            delete pendingSong[from];
            return reply("❌ *Download failed!*");
          }

          await conn.sendMessage(
            from,
            {
              audio: { url: song.download.url },
              mimetype: "audio/mpeg",
            },
            { quoted: msg }
          );

          await conn.sendMessage(from, {
            text: "✅ *Audio Download Successful!* 🎶",
            edit: wait.key,
          });

          delete pendingSong[from];
        } catch (e) {
          console.log(e);
        }
      });
    } catch (e) {
      console.error(e);
      reply(`❌ *Error:* ${e.message}`);
    }
  }
);
