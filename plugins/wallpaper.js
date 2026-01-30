const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "wall",
    alias: ["image"],
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
          "කරුණාකර wallpaper search කරන්න keyword එකක් type කරන්න.\n\n" +
          "_Example:_ `.wall anime`\n\n" +
          "> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏"
        );
      }

      await reply(
        "🔍 *Searching HD Wallpapers...*\n" +
        "Please wait a moment ⏳\n\n" +
        "> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏"
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
          "> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏"
        );
      }

      const selected = wallpapers.slice(0, 5);

      await conn.sendMessage(
        from,
        {
          image: {
            url: "https://files.catbox.moe/h1xuqv.jpg",
          },
          caption:
            "🖼️ *ISHAN SPARK-X – WALLPAPER DOWNLOADER*\n\n" +
            `🔎 Keyword: *${q}*\n` +
            `📂 Results: *${selected.length} HD Wallpapers*\n\n` +
            "> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏",
        },
        { quoted: mek }
      );

      for (const wallpaper of selected) {
        const caption =
          "🖼️ *HD Wallpaper*\n\n" +
          `📐 Resolution: *${wallpaper.resolution}*\n` +
          `🔗 Source: ${wallpaper.url}\n\n` +
          "> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏";

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
