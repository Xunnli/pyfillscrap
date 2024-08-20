import pkg from 'whatsapp-web.js';
import fs from 'fs';
import { exec } from 'child_process';
const { Client, MessageMedia, Location, List, Buttons, LocalAuth } = pkg;
import { fillarm, fillweap, livetoram, cekkhodam, mt_toram, boostoram, update_toram, orb_Shop, tghide, tgall, brod, bossdata, sticker, showgpt, tampildinamis, getId, pingCommand, ruteshow, xtallshow, advspam, advshow, Bufftampil, bagtampil, matstampil, dinamis, carilvl, kirimdye, editcommand, tambahcommand, buatcommand, hapuscommand, donasi, nvai } from './command/command.js';
import { allowedUser, blocked } from './command/allow.js';
import qrcode from 'qrcode-terminal';
import path from 'path';

import { keepAlive } from './keep_alive.js';

keepAlive();

const __dirname = path.dirname(new URL(import.meta.url).pathname);
let lastCommand = '';
let lastCommandTime = new Date();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--no-experiments',
            '--hide-scrollbars',
            '--disable-plugins',
            '--disable-infobars',
            '--disable-translate',
            '--disable-pepper-3d',
            '--disable-extensions',
            '--disable-dev-shm-usage',
            '--disable-notifications',
            '--disable-setuid-sandbox',
            '--disable-crash-reporter',
            '--disable-smooth-scrolling',
            '--disable-login-animations',
            '--disable-dinosaur-easter-egg',
            '--disable-accelerated-2d-canvas',
            '--disable-rtc-smoothness-algorithm',
            "--disable-gpu",
            "--no-zygote"
        ],
    },
});

client.initialize();


client.on("loading_screen", (percent, message) => {
    console.log("Loading..", percent, message);
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log(qr);
});

client.on("authenticated", () => {
    console.log("Diauntentikasi");
});

client.on("auth_failure", (msg) => {
    console.error("Gagal Autentikasi ", msg);
});

client.on("ready", () => {
    console.log("Client Ready");

});

client.on("group_join", async (notification) => {
    try {
        const chatId = notification.id.remote;
        const chat = await notification.getChat();
        const participantId = notification.id.participant;
        const contact = await client.getContactById(participantId);

        await chat.sendMessage(
            `Welcome @${contact.number.replace("@c.us", "")}, Jangan lupa intro.`,
            {
                mentions: [contact],
            },
        );
    } catch (error) {
        console.log("Something went wrong", error);
    }
});

const lastReplyTimes = new Map();


client.on("message", async (mseg) => {
    let userId = "";
    const grupid = mseg.from;
    const chat = await mseg.getChat();
    if (chat.isGroup) {
        userId = mseg.author;
    } else {
        userId = mseg.from;
    }

    if (mseg.body.startsWith(".")) {
        await dinamis(mseg);
    }


    if (allowedUser.includes(userId) || allowedUser.includes(grupid) || blocked.includes(userId) || blocked.includes(grupid)) {
        if (mseg.body.startsWith(".")) {
            if (!chat.isGroup) {
                if (blocked.includes(userId)) {
                    await mseg.reply("Lu gabole pake command");
                    return;
                }
            } else {
                if (blocked.includes(userId) && blocked.includes(grupid)) {
                    await mseg.reply("kamu dan grup ini di blacklist");
                    return;
                } else if (blocked.includes(userId)) {
                    await mseg.reply("Lu gabole pake command di grup");
                    return;
                } else if (blocked.includes(grupid)) {
                    await tag(mseg);
                    return;
                }
            }
            await handleCommand(mseg);
            await tag(mseg);
        }
    } else {
        if (lastReplyTimes.has(userId)) {
            const lastReplyTime = lastReplyTimes.get(userId);
            const currentTime = new Date().getTime();
            if (currentTime - lastReplyTime >= 10 * 1000) {
                lastReplyTimes.delete(userId);
                await handleCommand(mseg);
                await tag(mseg);
            } else {
                return;
            }
        } else {
            await handleCommand(mseg);
            await tag(mseg);
        }
    }
});

async function tag(mseg) {
    let userId = "";
    const chat = await mseg.getChat();
    if (chat.isGroup) {
        userId = mseg.author;
    } else {
        userId = mseg.from;
    }

    if (mseg.body.toLowerCase() === ".hidetag") {
        await tghide(client, mseg);
    }

    if (mseg.body.toLowerCase() === ".tagall") {
        await tgall(client, mseg);
    }
    if (mseg.body.toLowerCase() === ".tes") {
        const contact = await mseg.getContact();
        const name = contact.pushname
        const chat = await mseg.getChat();
        await mseg.reply(`haloo ${name}`);
    }

    lastReplyTimes.set(userId, new Date().getTime());
}

async function handleCommand(mseg) {
    let userId = "";
    const chat = await mseg.getChat();
    if (chat.isGroup) {
        userId = mseg.author;
    } else {
        userId = mseg.from;
    }

    if (mseg.body.toLowerCase().startsWith(".fill")) {

        // await fillForm(mseg);
        const args = mseg.body.slice(6).trim(); // Mengambil bagian argumen setelah ".updateform"
        const pythonScriptPath = path.join(__dirname, "command", "tanaka.py");

        exec(`python3 ${pythonScriptPath} "${args}"`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error}`);
                await mseg.reply("Error updating form");
                return;
            }
            console.log(`Output: ${stdout}`);
            console.error(`Error: ${stderr}`);
            await mseg.reply(stdout);
        });
    }

    if (mseg.body.toLowerCase().startsWith(".fillweap")) {
        await fillweap(mseg);
    }

    if (mseg.body.toLowerCase().startsWith(".fillarm")) {
        await fillarm(mseg);
    }


    if (mseg.body.toLowerCase() === ".hi") {
        const contact = await mseg.getContact();
        const name = contact.pushname
        const chat = await mseg.getChat();
        await mseg.reply(`haloo ${name}`);
    }

    if (mseg.body.toLowerCase().startsWith(".id")) {
        await getId(mseg);
    }

    if (mseg.body.toLowerCase().startsWith(".kinda")) {
        await nvai(mseg, client);
    }

    if (mseg.body.toLowerCase().startsWith(".bot")) {
        await showgpt(mseg);
    }

    if (mseg.body.toLowerCase() === ".stats") {
        await pingCommand(mseg);
    }

    if (mseg.body.toLowerCase().startsWith(".bag")) {
        await bagtampil(mseg);
    }

    if (mseg.body.toLowerCase().startsWith(".buff")) {
        await Bufftampil(mseg);
    }

    if (mseg.body.toLowerCase().startsWith(".mats")) {
        await matstampil(mseg);
    }

    if (mseg.body.toLowerCase() === ".dye") {
        kirimdye(mseg);
    }

    if (mseg.body.toLowerCase() === ".donasi") {
        await donasi(mseg);
    }

    if (mseg.body.toLowerCase() === ".updatedye") {
        const chat = await mseg.getChat();
        const pythonScriptPath = path.join(__dirname, "command", "scrap.py");
        exec(`python3 ${pythonScriptPath}`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error}`);
                await mseg.reply("error update dye");
                return;
            }
            console.log(`Output: ${stdout}`);
            console.error(`Error: ${stderr}`);
            await mseg.reply("dye sukses di update");
        });
    }

    if (mseg.body.toLowerCase().startsWith(".lvl ")) {
        await carilvl(mseg);
    }

    if (mseg.body.toLowerCase().startsWith(".boss")) {
        await bossdata(mseg);
    }

    if (mseg.body.toLowerCase().startsWith(".adv ")) {
        await advshow(mseg);
    }

    if (mseg.body.toLowerCase().startsWith(".spamadv ")) {
        await advspam(mseg);
    }

    if (mseg.body.toLowerCase().startsWith(".xtall ")) {
        await xtallshow(mseg);
    }

    if (mseg.body.toLowerCase().startsWith(".rute ")) {
        await ruteshow(mseg);
    }

    if (mseg.body.toLowerCase().startsWith(".add ")) {
        await tambahcommand(mseg);
    }

    if (mseg.body.toLowerCase().startsWith(".edit ")) {
        await editcommand(mseg);
    }

    if (mseg.body.toLowerCase().startsWith(".create ")) {
        await buatcommand(mseg);
    }

    if (mseg.body.toLowerCase().startsWith(".delete ")) {
        await hapuscommand(mseg);
    }

    if (mseg.body.toLowerCase() === ".sticker") {
        await sticker(mseg);
    }

    if (mseg.body.startsWith('.broad')) {
        await brod(client, mseg);
    }

    if (mseg.body.toLowerCase() === '.offnotif') {
        await mseg.reply("belom dibuat ngab h3h3");
    }

    if (mseg.body.toLowerCase() === ".toramshop") {
        await orb_Shop(mseg);
    }

    if (mseg.body.toLowerCase() === ".toramupdate") {
        await update_toram(mseg);
    }

    if (mseg.body.toLowerCase() === ".toramboost") {
        await boostoram(mseg);
    }

    if (mseg.body.toLowerCase() === ".torammt") {
        await mt_toram(mseg);
    }

    if (mseg.body.toLowerCase() === ".toramlive") {
        await livetoram(mseg);
    }

    if (mseg.body.toLowerCase().startsWith(".khodam")) {
        await cekkhodam(mseg);
    }

    if (mseg.body.startsWith('.nama')) {
        const mentionedIds = mseg.mentionedIds;

        if (mentionedIds.length > 0) {
            const responses = await Promise.all(
                mentionedIds.map(async id => {
                    const contact = await client.getContactById(id);
                    return `Nama dia adalah ${contact.pushname || contact.name || 'tidak diketahui'}`;
                })
            );

            mseg.reply(responses.join('\n'));
        } else {
            mseg.reply('Tidak ada tag dalam pesan ini.');
        }
    }

    lastReplyTimes.set(userId, new Date().getTime());
}