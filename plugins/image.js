const { cmd } = require("../command");
const axios = require("axios");
const fetch = require("node-fetch");
const {
  generateWAMessageContent,
  generateWAMessageFromContent
} = require("@whiskeysockets/baileys");

cmd(
  {
    pattern: "image",
    alias: ["wallpaper"],
    react: "🖼️",
    desc: "Download HD Wallpapers",
    category: "download",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!q) {
        return reply(
          "🖼️ *HD Wallpaper Downloader*\n\n" +
          "Wallpaper search keyword එකක් type කරන්න.\n\n" +
          "_Example:_ `.wall anime`\n\n" +
          "> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏"
        );
      }

      await reply("🔍 *Searching HD Wallpapers...* ⏳");

      const res = await axios.get(
        `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(
          q
        )}&sorting=random&resolutions=1920x1080,2560x1440,3840x2160`
      );

      const wallpapers = res.data.data;
      if (!wallpapers || wallpapers.length === 0) {
        return reply("❌ *No wallpapers found!*");
      }

      const selected = wallpapers.slice(0, 6);
      const cards = [];

      for (const [i, wall] of selected.entries()) {
        try {
          const imgRes = await fetch(wall.path);
          const buffer = Buffer.from(await imgRes.arrayBuffer());

          const media = await generateWAMessageContent(
            { image: buffer },
            { upload: conn.waUploadToServer }
          );

          if (!media.imageMessage) continue;

          cards.push({
            header: {
              title: `Wallpaper ${i + 1}`,
              hasMediaAttachment: true,
              imageMessage: media.imageMessage
            },
            body: {
              text: `📐 ${wall.resolution}`
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "Open Wallpaper",
                    url: wall.url
                  })
                },
                {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: "Copy Image URL",
                    copy_code: wall.path
                  })
                }
              ]
            }
          });

          await new Promise(r => setTimeout(r, 700));
        } catch (e) {
          console.log("Wallpaper skip:", e.message);
        }
      }

      if (cards.length === 0) {
        return reply("❌ *Failed to load wallpapers!*");
      }

      const msg = generateWAMessageFromContent(
        from,
        {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: {
                header: {
                  title: `🖼️ HD Wallpapers for "${q}"`
                },
                body: {
                  text: ""
                },
                footer: {
                  text: "©🄿🄾🅆🄴🅁🄴🄳 🄱🅈 🄸🅂🄷🄰🄽-🅇"
                },
                carouselMessage: {
                  cards
                }
              }
            }
          }
        },
        { quoted: mek }
      );

      await conn.relayMessage(from, msg.message, {
        messageId: msg.key.id
      });

    } catch (e) {
      console.error(e);
      reply("❌ *Wallpaper search failed!*");
    }
  }
);
