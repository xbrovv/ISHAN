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
    quoted,
    body,
    isCmd,
    args,
    q,
    isGroup,
    sender,
    senderNumber,
    botNumber2,
    botNumber,
    pushname,
    isMe,
    isOwner,
    groupMetadata,
    groupName,
    participants,
    groupAdmins,
    isBotAdmins,
    isAdmins,
    reply
}) => {
    try {
        // Function to return ✅ or ❌ based on the boolean value, considering multiple formats
        const statusIcon = (status) => {
            return (status === true || status === 'true' || status === 1) ? "✅" : "❌";
        };

        // Create the settings message with the updated format
        let madeSetting = `*╭──⚙️ ${config.BOT_NAME} Settings ⚙️─❖●►*
┃ 💿 *➤ Auto Status seen*: ${statusIcon(config.AUTO_STATUS_SEEN)}
┃ ❤️ *➤ Auto status react*: ${statusIcon(config.AUTO_STATUS_REACT)}
┃ 📲 *➤ Auto status forward*: ${statusIcon(config.AUTO_STATUS_FORWARD)}
┃ 🚫 *➤ Anti Delete*: ${statusIcon(config.ANTI_DELETE)}
┃ 📌 *➤ Prefix*: *[ ${config.PREFIX} ]*
┃ ⚙️ *➤ Mode*: *${config.MODE}*
┃ 📞 *➤ Bot owner*: *${config.BOT_OWNER}*
┃ 🤖 *➤ Bot Name*: *${config.BOT_NAME}*
┃ 👑 *➤ owner name*: *${config.OWNER_NAME}*
*╰─────────────────────❖●►*

*🌟DEVELOPED BY ISHAN-X MD🌟*
`;

        // Send the settings message with the updated format
        await ishan.sendMessage(from, {
            image: { url: config.ALIVE_IMG },
            caption: madeSetting
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
