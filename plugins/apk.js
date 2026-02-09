const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "apk",
    alias: ["android", "app"],
    react: "📦",
    desc: "Download your favourite Android APK",
    category: "download",
    filename: __filename,
  },
  async (ishan, mek, m, { q, reply, from }) => {
    try {
      if (!q) {
        return reply(
          "📱 *APK Downloader*\n\n" +
          "❗ your App name.\n" +
          "Example:\n" +
          "`.apk WhatsApp`\n\n" +
          "> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏"
        );
      }

      await ishan.sendMessage(from, {
        react: { text: "🔍", key: mek.key },
      });

      const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(
        q
      )}/limit=1`;

      const { data } = await axios.get(apiUrl);

      if (!data?.datalist?.list?.length) {
        return reply(
          "⚠️ *APK not found*\n\n" +
          "no searching results.\n" +
          "Please try again.\n\n" +
          "> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏"
        );
      }

      const app = data.datalist.list[0];
      const appSize = app.size
        ? (app.size / 1048576).toFixed(2)
        : "Unknown";

      const caption =
        "📦 *APK DOWNLOADER*\n\n" +
        `📱 *App:* ${app.name}\n` +
        `🏷️ *Package:* ${app.package}\n` +
        `📊 *Size:* ${appSize} MB\n\n` +
        "📥 *Downloading APK...*\n\n" +
        "> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏";

      await ishan.sendMessage(
        from,
        {
          image: { url: app.icon },
          caption: caption,
        },
        { quoted: mek }
      );

      await ishan.sendMessage(
        from,
        {
          document: { url: app.file.path_alt },
          fileName: `${app.name}.apk`,
          mimetype: "application/vnd.android.package-archive",
        },
        { quoted: mek }
      );

      await ishan.sendMessage(from, {
        react: { text: "✅", key: mek.key },
      });
    } catch (err) {
      console.error("❌ APK Downloader Error:", err);
      reply(
        "❌ *APK download failed*\n\n" +
        "Server issue & temporary erro.\n" +
        "Please try again.\n\n" +
        "> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏"
      );
    }
  }
);
