const { cmd } = require("../command");
const axios = require("axios");
const crypto = require("crypto");

async function igdl(url) {
  try {
    const key = Buffer.from("qwertyuioplkjhgf", "utf-8");
    const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
    cipher.setAutoPadding(true);

    let encrypted = cipher.update(url, "utf-8", "hex");
    encrypted += cipher.final("hex");

    const response = await axios({
      method: "get",
      url: "https://api.videodropper.app/allinone",
      headers: {
        accept: "*/*",
        origin: "https://fastvideosave.net",
        referer: "https://fastvideosave.net/",
        "user-agent": "Mozilla/5.0",
        url: encrypted
      }
    });

    return response.data;

  } catch (error) {
    if (error.response) {
      return { status: false, msg: error.response.data };
    }
    return { status: false, msg: error.message };
  }
}

cmd({
  pattern: "ig",
  desc: "Download Instagram Video",
  category: "download",
  use: ".ig <link>",
  filename: __filename
}, async (ishan, mek, m, { from, args }) => {

  if (!args[0]) {
    return ishan.sendMessage(from, { text: "Please give Instagram link!" }, { quoted: mek });
  }

  const link = args[0];

  if (!link.includes("instagram.com")) {
    return ishan.sendMessage(from, { text: "Invalid Instagram link!" }, { quoted: mek });
  }

  await ishan.sendMessage(from, { text: "⏳ Downloading..." }, { quoted: mek });

  const data = await igdl(link);

  if (!data || data.status === false) {
    return ishan.sendMessage(from, { text: "Download failed!" }, { quoted: mek });
  }

  // API response structure එක අනුව adjust කරන්න
  const videoUrl = data?.data?.media?.[0]?.url || data?.data?.url;

  if (!videoUrl) {
    return ishan.sendMessage(from, { text: "Video not found!" }, { quoted: mek });
  }

  await ishan.sendMessage(from, {
    video: { url: videoUrl },
    caption: "> © Developer by ISHAN-X"
  }, { quoted: mek });

});
