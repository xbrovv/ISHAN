const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "fact",
    alias: ["didyouknow"],
    react: "🧠",
    desc: "Get a random fun fact",
    category: "MATHTOOL",
    filename: __filename,
  },
  async (ishan, mek, m, { reply }) => {
    try {
      const res = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
      reply(`💡 *Did you know?*\n\n${res.data.text}`);
    } catch {
      reply("*Unable to fetch a fact right now.* ❌");
    }
  }
);
