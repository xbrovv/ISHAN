const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "animegirl",
    alias: ["waifu"],
    react: "💖",
    desc: "Sends a random waifu",
    category: "MATHTOOL",
    filename: __filename,
  },
  async (ishan, mek, m, { from, reply }) => {
    try {
      const res = await axios.get("https://nekos.best/api/v2/waifu");
      const image = res.data.results?.[0]?.url;

      if (!image) throw new Error("No waifu image found in response");

      const caption = `
╭━━❰ 💘 *RANDOM WAIFU*  ❱━━╮
╰━━━━━━━━━━━━━━━━━━━━╯`;

      await ishan.sendMessage(
        from,
        {
          image: { url: image },
          caption,
        },
        { quoted: mek }
      );
    } catch (err) {
      console.error("❌ WAIFU Error:", err.response?.data || err.message);
      reply("❌ *Failed to fetch waifu. Please try again later.*");
    }
  }
);
