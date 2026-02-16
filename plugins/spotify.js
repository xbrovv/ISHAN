// plugins/spotify.js
const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "spotify",
    react: "🎧",
    desc: "Download any Spotify track in high quality",
    category: "download",
    filename: __filename,
  },

  async (ishan, mek, m, { from, args, reply }) => {
    try {
      const query = args.join(" ");
      if (!query)
        return reply("🎧 *Please send a valid Spotify song link!*\nExample: .spotify https://open.spotify.com/track/xxx");

      // Spotify downloader API
      const api = `https://api.spotifydown.com/download?url=${encodeURIComponent(query)}`;
      const res = await axios.get(api);

      if (!res.data || !res.data.link) {
        return reply("❌ *Failed to download.* Try another Spotify link.");
      }

      const { title, artists, cover, link } = res.data;

      // Send track metadata
      await ishan.sendMessage(
        from,
        {
          image: { url: cover },
          caption: `
*┌───〔 🎧 ISHAN MD — SPOTIFY DOWNLOADER 〕───┐*

🎵 *Title:* ${title}
👤 *Artist:* ${artists}
🔗 *Link:* Provided by user

Please wait, your audio is being sent...

*└─────────────────────────────────────┘*
🔥 Powered by *ISHAN MD*
          `.trim(),
        },
        { quoted: mek }
      );

      // Send MP3 audio
      await ishan.sendMessage(
        from,
        {
          audio: { url: link },
          mimetype: "audio/mpeg",
          fileName: `${title}.mp3`,
        },
        { quoted: mek }
      );

    } catch (e) {
      console.error("Spotify Error:", e);
      reply(`❌ *Error downloading track:*\n${e.message}`);
    }
  }
);
