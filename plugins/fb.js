
const { cmd, commands } = require("../command");
const getFbVideoInfo = require("@xaviabot/fb-downloader");

const FOOTER = "\n\n> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏";

cmd({
  pattern: "fb",
  alias: ["facebook"],
  react: "📘",
  desc: "Download Facebook Video",
  category: "download",
  filename: __filename,
}, async (bot, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply(
      "📘 *Facebook video download කිරීමට valid link එකක් දාන්න!*\n" +
      "✨ *Example:* `fb https://www.facebook.com/...`" +
      FOOTER
    );

    const fbRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/.+/;
    if (!fbRegex.test(q)) return reply(
      "❌ *Invalid Facebook URL!*\n" +
      "👉 *කරුණාකර හරි link එකක් check කරලා නැවත try කරන්න*" +
      FOOTER
    );

    await reply("🔎 *SEARCHING YOUR FACEBOOK VIDEO...*");

    const result = await getFbVideoInfo(q);
    if (!result || (!result.sd && !result.hd)) return reply(
      "❌ *Video download කරන්න බැරි වුණා!*\n" +
      "🔁 *කරුණාකර ටික වෙලාවකට පස්සේ නැවත try කරන්න*" +
      FOOTER
    );

    const { title, sd, hd } = result;
    const bestQualityUrl = hd || sd;
    const qualityText = hd ? "HD" : "SD";

    const caption =
`*┎━━━━━━━━━━━━━━━━❖●►*
*┃➤ 🎬 Title   :* ${title || "Unknown"}
*┃➤ 🎥 Quality :* ${qualityText}
*┃➤ 🔗 Source  :* Facebook
*┗━━━━━━━━━━━━━━━━❖●►*\n\n\n
╭━━━━━━━❖◆►
┃➤ 🔮 𝗥𝗘𝗣𝗟𝗬 ❶ 𝗧𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 💻
╰━━━━━━━❖◆►` +
FOOTER;

    const sentMsg = await bot.sendMessage(
      from,
      { image: { url: "https://files.catbox.moe/h1xuqv.jpg" }, caption },
      { quoted: mek }
    );

    await bot.sendMessage(from, { react: { text: "📘", key: sentMsg.key } });

    const messageID = sentMsg.key.id;

    // Listen for reply
    const listener = async (update) => {
      try {
        const mekInfo = update?.messages[0];
        if (!mekInfo?.message) return;

        const messageType =
          mekInfo?.message?.conversation ||
          mekInfo?.message?.extendedTextMessage?.text;

        const isReplyToSentMsg =
          mekInfo?.message?.extendedTextMessage?.contextInfo?.stanzaId ===
          messageID;

        if (!isReplyToSentMsg) return;

        const userReply = messageType.trim();
        if (userReply !== "1") return; // only proceed if user replies "1"

        const processMsg = await bot.sendMessage(from, { text: "*⏳ LOADING...*" }, { quoted: mek });

        await bot.sendMessage(
          from,
          { video: { url: bestQualityUrl }, caption: `📥 *Downloaded in ${qualityText} quality*` + FOOTER },
          { quoted: mek }
        );

        await bot.sendMessage(from, { text: "✅ COMPLETED", edit: processMsg.key });

        // Remove listener after first valid reply
        bot.ev.off("messages.upsert", listener);
      } catch (err) {
        console.error(err);
        reply(`❌ *An error occurred while processing:* ${err.message || "Error!"}`);
        bot.ev.off("messages.upsert", listener);
      }
    };

    bot.ev.on("messages.upsert", listener);

  } catch (e) {
    console.error("FB ERROR:", e);
    reply("⚠️ *Facebook video download failed, please try again*" + FOOTER);
  }
});
