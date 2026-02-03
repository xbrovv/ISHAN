const { cmd } = require("../command");
const yts = require("yt-search");

const FOOTER = "\n\n> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏";

cmd(
  {
    pattern: "yts",
    alias: ["yt", "youtubesearch"],
    react: "🔎",
    desc: "Search YouTube videos",
    category: "search",
    filename: __filename,
  },
  async (
    ishan,
    mek,
    m,
    {
      from,
      quoted,
      q,
      reply,
    }
  ) => {
    try {
      // ❌ No search query
      if (!q) {
        return reply(
          "🔎 *YouTube Search keyword Send*\n" +
          "✨ *Example:* `yts Alan Walker`" +
          FOOTER
        );
      }

      // ⌛ Searching message
      await reply(
        "🔍 *𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶 𝙾𝙽 𝚈𝙾𝚄𝚃𝚄𝙱𝙴*\n" +
        "⏳ *𝙻𝙾𝙰𝙳𝙸𝙽𝙶...*" +
        FOOTER
      );

      const search = await yts(q);

      // ❌ No results
      if (!search || !search.all || search.all.length === 0) {
        return reply(
          "😕 * No YouTube results *\n" +
          "👉 *Please try again*" +
          FOOTER
        );
      }

      const results = search.videos.slice(0, 10);

      const formattedResults = results
        .map(
          (v, i) =>
            `🎬 *${i + 1}. ${v.title}*\n` +
            `⏱️ Duration: ${v.timestamp} | 👁️ Views: ${v.views.toLocaleString()}\n` +
            `📅 Uploaded: ${v.ago}\n` +
            `🔗 Watch: ${v.url}`
        )
        .join("\n\n");

      const caption =
`🚀 *ISHAN SPARK-X — YouTube Search Results*
◄✦✦─────────────────────────✦✦►
🔎 *Search Query:* ${q}

${formattedResults}
${FOOTER}
`;

      await ishan.sendMessage(
        from,
        {
          image: {
            url: "https://files.catbox.moe/h1xuqv.jpg",
          },
          caption,
        },
        { quoted: mek }
      );
    } catch (err) {
      console.error(err);
      reply(
        "❌ *YouTube search failed*\n" +
        "🔁 *Please try again*" +
        FOOTER
      );
    }
  }
);
