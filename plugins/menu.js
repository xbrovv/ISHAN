const { cmd, commands } = require("../command");
const moment = require("moment-timezone");
const os = require("os");
const axios = require("axios");

cmd({
  pattern: "menu",
  react: "📜",
  alias: ["panel", "commands"],
  desc: "Get Bot Menu",
  category: "main",
  filename: __filename
}, async (ishan, mek, m, { from, pushname, reply }) => {
  try {

    const date = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
    const time = moment().tz("Asia/Colombo").format("HH:mm:ss");

    const ownerdata = (await axios.get(
      "https://raw.githubusercontent.com/ishanxmd/Data/refs/heads/main/details.json"
    )).data;

    const FOOTER = ownerdata.footer;
    const IMAGE_URL = ownerdata.imageurl;
    const ALIVE_VIDEO = ownerdata.alivevideo;
    const OWNER_NAME = ownerdata.ownername;
    const OWNER_NUMBER = ownerdata.ownernumber;

    const qMessage = {
      key: {
        fromMe: false,
        remoteJid: "status@broadcast",
        participant: "0@s.whatsapp.net",
      },
      message: {
        locationMessage: {
          degreesLatitude: 40.7128,
          degreesLongitude: -74.0060,
          name: "Monaragala",
          address: "Siyambalanduwa",
        }
      }
    };

    const menuText = `👋 *Hello, ${pushname}*
*🫟 Wᴇʟᴄᴏᴍᴇ Tᴏ Qᴜᴇᴇɴ-ɴᴇᴛʜᴜ-Mᴅ 🫟*

*╭─「 ꜱᴛᴀᴛᴜꜱ ᴅᴇᴛᴀɪʟꜱ 」*
*│* 🤵 *Owner* : ${OWNER_NAME}
*│* 📞 *Number* : ${OWNER_NUMBER}
*│* 🕒 *Time* : ${time}
*│* 📅 *Date* : ${date}
*│* 📋 *Categories* : 9
*╰──────────●●►*

*\`Reply Below Number 🔢\`*

│ ◦ *1* \`\`\`OWNER MENU\`\`\`
│ ◦ *2* \`\`\`AI MENU\`\`\`
│ ◦ *3* \`\`\`SEARCH MENU\`\`\`
│ ◦ *4* \`\`\`DOWNLOAD MENU\`\`\`
│ ◦ *5* \`\`\`MAIN MENU\`\`\`
│ ◦ *6* \`\`\`CONVERT MENU\`\`\`
│ ◦ *7* \`\`\`OTHER MENU\`\`\`
│ ◦ *8* \`\`\`LOGO MENU\`\`\`
│ ◦ *9* \`\`\`GROUP MENU\`\`\`

${FOOTER}`;

    await ishan.sendMessage(from, {
      video: { url: ALIVE_VIDEO },
      mimetype: "video/mp4",
      ptv: true
    }, { quoted: mek });

    const sentMsg = await ishan.sendMessage(from, {
      image: { url: IMAGE_URL },
      caption: menuText
    }, { quoted: mek });

    ishan.ev.on("messages.upsert", async (msgUpdate) => {
      const msg = msgUpdate.messages[0];
      if (!msg.message?.extendedTextMessage) return;

      if (
        msg.message.extendedTextMessage.contextInfo?.stanzaId !== sentMsg.key.id
      ) return;

      const userResponse = msg.message.extendedTextMessage.text.trim();

      const menuMap = {
        "1": "owner",
        "2": "ai",
        "3": "search",
        "4": "download",
        "5": "main",
        "6": "convert",
        "7": "other",
        "8": "logo",
        "9": "group"
      };

      if (!menuMap[userResponse]) {
        return reply("*Please Reply Valid Number ❗*");
      }

      const selected = menuMap[userResponse];
      let list = "";

      for (const cmd of commands) {
        if (cmd.category === selected && !cmd.dontAddCommandList) {
          list += `*╭──────────●●►*
*│ Command:* .${cmd.pattern}
*│ Desc:* ${cmd.desc || "No description"}
*│ Use:* ${cmd.use || "-"}
*╰──────────●●►*\n\n`;
        }
      }

      const finalMenu = `*◈ ${selected.toUpperCase()} COMMAND LIST ◈*

${list}
${FOOTER}`;

      await ishan.sendMessage(from, {
        image: { url: IMAGE_URL },
        caption: finalMenu
      }, { quoted: qMessage });

    });

  } catch (e) {
    console.error(e);
    reply("*ERROR ❗*");
  }
});
