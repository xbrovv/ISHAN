const { cmd } = require('../command')
const fg = require('api-dylux')
const yts = require('yt-search')

//==================== Video downloader =========================

cmd({
    pattern: 'video',
    alias: ["v","mp4","videofile","vd"],
    desc: 'download videos',
    react: "📽",
    category: 'download',
    filename: __filename
},
async (ishan, mek, m, { from, q, reply }) => {
    try {

        const snm = [2025];

        // Fake quoted order message
        const qMessage = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast"
            },
            message: {
                orderMessage: {
                    itemCount: snm[Math.floor(Math.random() * snm.length)],
                    status: 1,
                    surface: 1,
                    message: `🎯 VIHAGA MD WHATSAPP BOT BY 🎯-:\nVIHANGA PEHESARA...💗`,
                    orderTitle: "",
                    sellerJid: '94704227534@s.whatsapp.net'
                }
            }
        };

        if (!q) return reply('*Please enter a query or a url !*');

        const search = await yts(q);
        if (!search.videos.length) return reply('*No results found ❌*');

        const data = search.videos[0];
        const url = data.url;

        let desc = `*📽Vihaga MD YT VIDEOS DOWNLOADER📽*
*|__________________________*
*|-ℹ️ 𝗧𝗶𝘁𝗹𝗲 :* ${data.title}
*|-🕘 𝗧𝗶𝗺𝗲 :* ${data.timestamp}
*|-📌 𝗔𝗴𝗼 :* ${data.ago}
*|-📉 𝗩𝗶𝗲𝘄𝘀 :* ${data.views}
*|-🔗 𝗟𝗶𝗻𝗸 :* ${data.url}
*|__________________________*

> *🔢 Reply Below Number :*

*1️⃣ Video File📽*
*2️⃣ Document File📁*

_*CREATE BY VIHANGA PEHESARA*_
_*POWERED BY MC ERROR OFC*_`;

        const vv = await ishan.sendMessage(
            from,
            { image: { url: data.thumbnail }, caption: desc },
            { quoted: mek }
        );

        ishan.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (
                msg.message.extendedTextMessage.contextInfo &&
                msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id
            ) {

                switch (selectedOption) {

                    case '1':
                        let downvid = await fg.ytv(url);
                        await conn.sendMessage(
                            from,
                            {
                                video: { url: downvid.dl_url },
                                caption: '_*CREATE BY VIHANGA PEHESARA*_\n_*POWERED BY MC ERROR OFC*_',
                                mimetype: 'video/mp4'
                            },
                            { quoted: qMessage }
                        );
                        break;

                    case '2':
                        let downviddoc = await fg.ytv(url);
                        await ishan.sendMessage(
                            from,
                            {
                                document: { url: downviddoc.dl_url },
                                caption: '_*CREATE BY VIHANGA PEHESARA*_\n_*POWERED BY MC ERROR OFC*_',
                                mimetype: 'video/mp4',
                                fileName: data.title + ".mp4"
                            },
                            { quoted: qMessage }
                        );
                        break;

                    default:
                        reply("Invalid option. Please select a valid option 🔴");
                }
            }
        });

    } catch (e) {
        console.error(e);
        await ishan.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('An error occurred while processing your request.');
    }
});
