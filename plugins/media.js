const { cmd } = require("../command");
const yts = require("yt-search");
const { ytmp3 } = require("sadaslk-dlcore");

cmd(
  {
    pattern: "song",
    alias: ["s", "p"],
    react: "🎶",
    desc: "Download YouTube Song",
    category: "download",
    use: ".song <song name | yt link>",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ Please provide a song name or YouTube link!");

      const search = await yts(q);
      if (!search.videos.length) return reply("❌ No results found!");

      const data = search.videos[0];
      const url = data.url;

      const info =
        `🌸 *SONG DOWNLOADER* 🌸\n\n` +
        `🎵 *Title:* ${data.title}\n` +
        `⏳ *Duration:* ${data.timestamp}\n` +
        `👀 *Views:* ${data.views.toLocaleString()}\n` +
        `🌏 *Uploaded:* ${data.ago}\n` +
        `👤 *Author:* ${data.author.name}\n` +
        `🔗 *Link:* ${url}\n\n` +
        `🔽 *Reply with your choice:*\n` +
        `> 1️⃣ Audio 🎵\n` +
        `> 2️⃣ Document 📁`;

      const sentMsg = await conn.sendMessage(
        from,
        { image: { url: data.thumbnail }, caption: info },
        { quoted: mek }
      );

      await conn.sendMessage(from, {
        react: { text: "🎧", key: sentMsg.key },
      });

      const messageID = sentMsg.key.id;

      // one-time reply listener
      conn.ev.on("messages.upsert", async (update) => {
        try {
          const msg = update.messages[0];
          if (!msg?.message) return;

          const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text;

          const isReply =
            msg.message.extendedTextMessage?.contextInfo?.stanzaId ===
            messageID;

          if (!isReply) return;

          let processMsg;
          const songData = await ytmp3(url, "192");

          if (!songData?.download?.url)
            return reply("❌ Download failed!");

          if (text.trim() === "1") {
            processMsg = await conn.sendMessage(
              from,
              { text: "⏳ Preparing audio..." },
              { quoted: mek }
            );

            await conn.sendMessage(
              from,
              {
                audio: { url: songData.download.url },
                mimetype: "audio/mpeg",
              },
              { quoted: mek }
            );
          } else if (text.trim() === "2") {
            processMsg = await conn.sendMessage(
              from,
              { text: "⏳ Preparing document..." },
              { quoted: mek }
            );

            await conn.sendMessage(
              from,
              {
                document: { url: songData.download.url },
                mimetype: "audio/mpeg",
                fileName: `${data.title}.mp3`,
                caption: `🎵 ${data.title}`,
              },
              { quoted: mek }
            );
          } else {
            return reply("❌ Invalid choice! Reply with 1️⃣ or 2️⃣");
          }

          await conn.sendMessage(from, {
            text: "✅ Download Successful",
            edit: processMsg.key,
          });
        } catch (err) {
          console.log(err);
          reply("❌ Error while processing song!");
        }
      });
    } catch (e) {
      console.log(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
