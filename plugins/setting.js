const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "settings",
    react: "🛠️",
    alias: ["setting", "env","set"],
    desc: "Get bot's settings list.",
    category: "owner",
    use: '.settings',
    filename: __filename
}, async (ishan, mek, m, {
    from,
    reply
}) => {
    try {

        const statusIcon = (status) => {
            return (status === true || status === 'true' || status === 1) ? "✅" : "❌";
        };

        let madeSetting = `*╭──⚙️ ${config.BOT_NAME} Settings ⚙️─❖●►*
┃ 💿 *➤ Auto Status seen*: ${statusIcon(config.AUTO_STATUS_SEEN)}
┃ ❤️ *➤ Auto status react*: ${statusIcon(config.AUTO_STATUS_REACT)}
┃ 📲 *➤ Auto status forward*: ${statusIcon(config.AUTO_STATUS_FORWARD)}
┃ 🚫 *➤ Anti Delete*: ${statusIcon(config.ANTI_DELETE)}
┃ 📌 *➤ Prefix*: *[ ${config.PREFIX} ]*
┃ ⚙️ *➤ Mode*: *${config.MODE}*
┃ 📞 *➤ Bot owner*: *${config.BOT_OWNER}*
┃ 🤖 *➤ Bot Name*: *${config.BOT_NAME}*
┃ 👑 *➤ Owner name*: *${config.OWNER_NAME}*
*╰─────────────────────❖●►*

*🌟 DEVELOPED BY ISHAN-X MD 🌟*
`;

        // 👉 මෙතන image URL එක direct දාන්න
        await ishan.sendMessage(from, {
            image: { 
                url: "https://files.catbox.moe/7pipjr.png"  // 🔥 මෙතන ඔයාගේ image link එක දාන්න
            },
            caption: madeSetting
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
