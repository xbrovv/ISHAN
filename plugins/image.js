const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "image",
    alias: ["wallpapers"],
    react: "🖼️",
    desc: "Download HD Wallpapers",
    category: "download",
    filename: __filename,
  },
  async (
    conn,
    mek,
    m,
    {
      from,
      q,
      reply,
    }
  ) => {
    try {
      if (!q) {
        return reply(
          "🖼️ *HD Wallpaper Downloader*\n\n" +
          "*type wallpaper search keyword*\n\n" +
          "_Example:_ `.wall anime`\n\n" +
          "> © 𝟸𝟶𝟸𝟼 𝙸𝚂𝙷𝙰𝙽-𝚇 𝙼𝙳"
        );
      }

      await reply(
        "🔍 *Searching HD Wallpapers...*\n" +
        "Please wait a moment ⏳\n\n" +
        "> © 𝟸𝟶𝟸𝟼 𝙸𝚂𝙷𝙰𝙽-𝚇 𝙼𝙳"
      );

      const res = await axios.get(
        `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(
          q
        )}&sorting=random&resolutions=1920x1080,2560x1440,3840x2160`
      );

      const wallpapers = res.data.data;

      if (!wallpapers || wallpapers.length === 0) {
        return reply(
          "❌ *No HD wallpapers found!*\n\n" +
          "Try a different keyword.\n\n" +
          "> © 𝟸𝟶𝟸𝟼 𝙸𝚂𝙷𝙰𝙽-𝚇 𝙼𝙳"
        );
      }

      const selected = wallpapers.slice(0, 10);

      await conn.sendMessage(
        from,
        {
          image: {
            url: "https://files.catbox.moe/qawlly.png",
          },
          caption:
            "🖼️ *ISHAN-X MD – WALLPAPER DOWNLOADER*\n\n" +
            `🔎 Keyword: *${q}*\n` +
            `📂 Results: *${selected.length} HD Wallpapers*\n\n` +
            "> © 𝟸𝟶𝟸𝟼 𝙸𝚂𝙷𝙰𝙽-𝚇 𝙼𝙳",
        },
        { quoted: mek }
      );

      for (const wallpaper of selected) {
        const caption =
          "🖼️ *HD Wallpaper*\n\n" +
          `📐 Resolution: *${wallpaper.resolution}*\n` +
          `🔗 Source: ${wallpaper.url}\n\n` +
          "> © 𝟸𝟶𝟸𝟼 𝙸𝚂𝙷𝙰𝙽-𝚇 𝙼𝙳";

        await conn.sendMessage(
          from,
          {
            image: { url: wallpaper.path },
            caption,
          },
          { quoted: mek }
        );
      }
    } catch (e) {
      console.error(e);
      reply(
        "❌ *Wallpaper download failed!*\n\n" +
        "Please try again later.\n\n" +
        "> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏"
      );
    }
  }
);
