const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const express = require("express");

// 🔹 Create bot
const bot = new TelegramBot(config.token, { polling: false });

// 🔹 Express server (for Railway uptime)
const app = express();
app.get("/", (req, res) => {
    res.send("Bot is running...");
});
app.listen(3000);

// 🔗 Register link
const link = "https://www.jaiclub04.com/#/register?invitationCode=376641278237";

// 🎯 Generate BIG/SMALL shots with numbers
function generateShots() {
    let shots = [];

    for (let i = 0; i < config.shotsPerSession; i++) {

        let type = Math.random() > 0.5 ? "BIG" : "SMALL";

        let num1, num2;

        if (type.includes("BIG")) {
            num1 = Math.floor(Math.random() * 5) + 5; // 5–9
            num2 = Math.floor(Math.random() * 5) + 5;
        } else {
            num1 = Math.floor(Math.random() * 5); // 0–4
            num2 = Math.floor(Math.random() * 5);
        }

        shots.push(
`${i + 1}. ${type} → ${num1}, ${num2}
👉 [Register Here](${link})`
        );
    }

    return shots.join("\n\n");
}

// 📤 Send session message
function sendSession(sessionNo) {
    const msg = `
🔥 *VIP PREDICTION* 🔥
⏱ *WINGO 1 MINUTE*

${generateShots()}

🚀 *NEW USER REGISTER FAST*
`;

    bot.sendMessage(config.channel, msg, { parse_mode: "Markdown" });
}

// ⏱ Scheduler
let currentSession = 1;
const interval = (24 * 60 * 60 * 1000) / config.sessionsPerDay;

setInterval(() => {
    sendSession(currentSession);
    currentSession++;

    if (currentSession > config.sessionsPerDay) {
        currentSession = 1;
    }
}, interval);

// 🚀 Start immediately
sendSession(currentSession);
