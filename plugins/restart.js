const { cmd } = require("../command");

cmd(
  {
    pattern: "restart",
    react: "♻️",
    desc: "Restart the bot",
    category: "owner",
    filename: __filename,
  },
  async (bot, mek, m, { from, isOwner, reply }) => {
    try {
      if (!isOwner) {
        return reply("🚫 *This command is owner only!*");
      }

      await bot.sendMessage(from, {
        text:
          "♻️ *ISHAN SPARK-X Restarting...*\n" +
          "━━━━━━━━━━━━━━━━━━━━━━\n" +
          "Please wait a few seconds...",
      });

      // Small delay for message send
      setTimeout(() => {
        process.exit(0); // PM2 / Railway / Heroku will auto restart
      }, 1500);

    } catch (e) {
      console.error("RESTART ERROR:", e);
      reply("❌ Restart failed.");
    }
  }
);
