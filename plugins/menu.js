// plugins/menu.js
const { cmd, commands } = require("../command");
const config = require("../config");

cmd({
    pattern: "menu",
    react: "📜",
    alias: ["panel", "commands"],
    desc: "Get Bot Menu",
    category: "main",
    use: '.menu',
    filename: __filename
},
async (ishan, mek, m, { from, quoted, pushname, reply }) => {
    try {
        const config = await readEnv();

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

        
        const date = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
        const time = moment().tz("Asia/Colombo").format("HH:mm:ss");

        let host = os.hostname() || "render";
        if (host.length === 12) host = 'replit';
        else if (host.length === 36) host = 'heroku';
        else if (host.length === 8) host = 'koyeb';
        
        const ownerdata = (await axios.get('https://raw.githubusercontent.com/ishanxmd/Data/refs/heads/main/details.json')).data;
        const OWNER_NUMBER = ownerdata.ownernumber;
        const FOOTER = ownerdata.footer;
        const IMAGE_URL = ownerdata.imageurl;
        const ALIVE_VIDEO = ownerdata.alivevideo;
        const OWNER_NAME = ownerdata.ownername;
        
        const selectionMessage = `👋 *Hello, ${pushname}*
*🫟 Wᴇʟᴄᴏᴍᴇ Tᴏ Qᴜᴇᴇɴ-ɴᴇᴛʜᴜ-Mᴅ*🫟*
        
*╭─「 ꜱᴛᴀᴛᴜꜱ ᴅᴇᴛᴀɪʟꜱ 」*
*│* 🤵 *\`Owner\`* : ${OWNER_NAME}
*│* 📞 *\`Owner Number\`* : ${OWNER_NUMBER}
*│* 🚀 *\`Prefix\`* : ${config.PREFIX}
*│* 🕒 *\`Time\`* : ${time}
*│* 📅 *\`Date\`* : ${date}
*│* 📋 *\`Categories\`* : 9
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
            mimetype: 'video/mp4',
            ptv: true
        }, { quoted: mek });

        const sentMsg = await conn.sendMessage(from, {
            image: { url: IMAGE_URL },
            caption: selectionMessage,
            contextInfo: { forwardingScore: 999, isForwarded: false }
        }, { quoted: mek });

        ishan.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const userResponse = msg.message.extendedTextMessage.text.trim();
            if (msg.message.extendedTextMessage.contextInfo &&
                msg.message.extendedTextMessage.contextInfo.stanzaId === sentMsg.key.id) {

                const menuCategories = {
                    '1': 'owner',
                    '2': 'ai',
                    '3': 'search',
                    '4': 'download',
                    '5': 'main',
                    '6': 'convert',
                    '7': 'other',
                    '8': 'auto',
                    '9': 'group'
                };

                if (!menuCategories[userResponse]) {
                    await reply("*Please Reply The Number ❗❗*");
                    return;
                }

                const selectedCategory = menuCategories[userResponse];
                let menu = '';

                for (let i = 0; i < commands.length; i++) {
                    if (commands[i].category === selectedCategory && !commands[i].dontAddCommandList) {
                        menu += `*╭──────────●●►*\n*│Command:* ${commands[i].pattern}\n*│Desc:* ${commands[i].desc}\n*│Use:* ${commands[i].use}\n*╰──────────●●►*\n\n`;
                    }
                }

                const madeMenu = `*◈ ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Command List ◈*\n\n${menu}─────────────────────────\n${FOOTER}`;

                await ishan.sendMessage(from, {
                    image: { url: IMAGE_URL },
                    caption: madeMenu
                }, { quoted: qMessage });
            }
        });

    } catch (err) {
        console.error(err);
        await reply('*ERROR ❗❗*');
    }
}); 
