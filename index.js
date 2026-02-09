const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID,
  makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const fs = require('fs');
const P = require('pino');
const express = require('express');
const axios = require('axios');
const path = require('path');
const qrcode = require('qrcode-terminal');

const config = require('./config');
const { sms, downloadMediaMessage } = require('./lib/msg');
const {
  getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson
} = require('./lib/functions');
const { File } = require('megajs');
const { commands, replyHandlers } = require('./command');

const app = express();
const port = process.env.PORT || 8000;

const prefix = '.';
const ownerNumber = ['94761638379'];
const credsPath = path.join(__dirname, '/auth_info_baileys/creds.json');

async function ensureSessionFile() {
  if (!fs.existsSync(credsPath)) {
    if (!config.SESSION_ID) {
      console.error('❌ SESSION_ID env variable is missing.');
      process.exit(1);
    }

    console.log("🔄 creds.json not found. Downloading session from MEGA...");
    const filer = File.fromURL(`https://mega.nz/file/${config.SESSION_ID}`);

    filer.download((err, data) => {
      if (err) {
        console.error("❌ Failed to download session:", err);
        process.exit(1);
      }
      fs.mkdirSync(path.join(__dirname, '/auth_info_baileys/'), { recursive: true });
      fs.writeFileSync(credsPath, data);
      console.log("✅ Session restored");
      setTimeout(connectToWA, 2000);
    });
  } else {
    setTimeout(connectToWA, 1000);
  }
}

const antiDeletePlugin = require('./plugins/antidelete.js');
global.pluginHooks = global.pluginHooks || [];
global.pluginHooks.push(antiDeletePlugin);

async function connectToWA() {
  console.log("Connecting ISHAN-MD 🧬...");
  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, '/auth_info_baileys/'));
  const { version } = await fetchLatestBaileysVersion();

  const ishan = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    auth: state,
    version,
    syncFullHistory: true,
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
  });

  ishan.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        connectToWA();
      }
    } else if (connection === 'open') {
      console.log('✅ ISHAN-MD connected');

      const up = `𝗜𝗦𝗛𝗔𝗡-MD 🚀 ONLINE ✅
⚙️ Stable Mode
🚀 Production

> ©𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚋𝚢 𝙸𝚂𝙷𝙰𝙽-𝕏`;

      await ishan.sendMessage(ownerNumber[0] + "@s.whatsapp.net", {
        image: { url: "https://files.catbox.moe/h1xuqv.jpg" },
        caption: `ISHAN-MD connected ✅\n\nPREFIX: ${prefix}`
      });

      fs.readdirSync("./plugins/")
        .filter(f => f.endsWith(".js"))
        .forEach(p => require(`./plugins/${p}`));
    }
  });

  ishan.ev.on('creds.update', saveCreds);

  ishan.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      if (msg.messageStubType === 68) {
        await ishan.sendMessageAck(msg.key);
      }
    }

    const mek = messages[0];
    if (!mek || !mek.message) return;

    mek.message = getContentType(mek.message) === 'ephemeralMessage'
      ? mek.message.ephemeralMessage.message
      : mek.message;

    if (global.pluginHooks) {
      for (const plugin of global.pluginHooks) {
        if (plugin.onMessage) {
          try {
            await plugin.onMessage(ishan, mek);
          } catch (e) {
            console.log("onMessage error:", e);
          }
        }
      }
    }

    /* STATUS HANDLER */
    if (mek.key?.remoteJid === 'status@broadcast') {
      const senderJid = mek.key.participant || mek.key.remoteJid;
      const mentionJid = senderJid.includes("@") ? senderJid : senderJid + "@s.whatsapp.net";

      if (config.AUTO_STATUS_SEEN === "true") {
        await ishan.readMessages([mek.key]).catch(() => {});
      }

      if (config.AUTO_STATUS_REACT === "true" && mek.key.participant) {
        const emojis = ['❤️','🔥','💯','😎','🥰','💎','🌸'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        await ishan.sendMessage(mek.key.participant, {
          react: { text: emoji, key: mek.key }
        }).catch(() => {});
      }
      return;
    }

    const m = sms(ishan, mek);
    const type = getContentType(mek.message);
    const from = mek.key.remoteJid;

    const body =
      type === 'conversation' ? mek.message.conversation :
      type === 'extendedTextMessage' ? mek.message.extendedTextMessage.text :
      type === 'imageMessage' ? mek.message.imageMessage.caption :
      type === 'videoMessage' ? mek.message.videoMessage.caption : '';

    const isCmd = body.startsWith(prefix);
    const commandName = isCmd ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : '';
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(' ');

    const sender = mek.key.fromMe ? ishan.user.id : (mek.key.participant || mek.key.remoteJid);
    const senderNumber = sender.split('@')[0];
    const botNumber = ishan.user.id.split(':')[0];
    const isMe = botNumber.includes(senderNumber);
    const isOwner = ownerNumber.includes(senderNumber) || isMe;
    const botNumber2 = await jidNormalizedUser(ishan.user.id);

    const reply = (text) => ishan.sendMessage(from, { text }, { quoted: mek });

    if (isCmd) {
      const cmd = commands.find(c => c.pattern === commandName || c.alias?.includes(commandName));
      if (cmd) {
        if (cmd.react) ishan.sendMessage(from, { react: { text: cmd.react, key: mek.key } });
        try {
          await cmd.function(ishan, mek, m, { from, args, q, sender, isOwner, reply });
        } catch (e) {
          console.error("Command error:", e);
        }
      }
    }

    for (const handler of replyHandlers) {
      if (handler.filter(body, { sender, message: mek })) {
        await handler.function(ishan, mek, m, { from, body, sender, reply });
        break;
      }
    }
  });

  ishan.ev.on('messages.update', async (updates) => {
    if (global.pluginHooks) {
      for (const plugin of global.pluginHooks) {
        if (plugin.onDelete) {
          try {
            await plugin.onDelete(ishan, updates);
          } catch (e) {
            console.log("onDelete error:", e);
          }
        }
      }
    }
  });
}

ensureSessionFile();

app.get("/", (req, res) => res.send("ISHAN-MD started ✅"));
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
