
const { cmd } = require("../command");
const yts = require("yt-search");
const { ytmp3 } = require("sadaslk-dlcore");

// temp storage (per chat)
const songCache = {};

cmd(
  {
    pattern: "song",
    react: "🎶",
    desc: "Download Song",
    category: "download",
    filename: __filename,
  },
  async (ishan, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ *Please provide a song name*");

      const search = await yts(q);
      const data = search.videos[0];
      if (!data) return reply("❌ *Song not found*");

      // cache song url for button action
      songCache[from] = {
        url: data.url,
        title: data.title,
        duration: data.timestamp,
        thumbnail: data.thumbnail,
      };

      const caption = `
🎶 *ISHAN-X MD SONG DOWNLOADER* 🎶

🎵 *Title:* ${data.title}
⏱️ *Duration:* ${data.timestamp}
👀 *Views:* ${data.views.toLocaleString()}

👇 Click below to get audio file
`;

      await ishan.sendMessage(
        from,
        {
          image: { url: data.thumbnail },
          caption,
          buttons: [
            {
              buttonId: "song_audio",
              buttonText: { displayText: "🎧 Audio File" },
              type: 1,
            },
          ],
          headerType: 4,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.log(e);
      reply("❌ *Error while searching song*");
    }
  }
);

// button handler
cmd(
  {
    pattern: "song_audio",
    dontAddCommandList: true,
  },
  async (ishan, mek, m, { from, reply }) => {
    try {
      const song = songCache[from];
      if (!song) return reply("❌ *Song data expired. Search again.*");

      const quality = "192";
      const songData = await ytmp3(song.url, quality);

      await ishan.sendMessage(
        from,
        {
          audio: { url: songData.download.url },
          mimetype: "audio/mpeg",
          ptt: false,
        },
        { quoted: mek }
      );

      delete songCache[from];
    } catch (e) {
      console.log(e);
      reply("❌ *Error while sending audio*");
    }
  }
);
