const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const express = require("express");

// 🔹 Bot setup
const bot = new TelegramBot(config.token, { polling: false });

// 🔹 Server (Railway)
const app = express();
app.get("/", (req, res) => {
    res.send("Bot is running...");
});
app.listen(3000);

// 🔗 Register link
const link = "https://www.jaiclub04.com/#/register?invitationCode=376641278237";

// ⏱ Fixed session times
const sessionTimes = ["09:30","11:00","13:00","14:26","16:30","19:00","21:00"];

// 🎯 Result sessions
const resultSessions = ["13:00","14:30","16:30","19:00"];
const resultDelay = 60100;

// 🌐 API config
const API_URL = "https://api.bdg88zf.com/api/webapi/GetGameIssue";

async function getPeriod() {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                typeId: 1,
                language: 0,
                random: "40079dcba93a48769c6ee9d4d4fae23f",
                signature: "D12108C4F57C549D82B23A91E0FA20AE",
                timestamp: Math.floor(Date.now() / 1000)
            })
        });

        const data = await res.json();

        // ⚠️ Adjust this key if needed
        let issue = data?.data?.issueNumber || "0000";

        return issue.toString().slice(-4);

    } catch (err) {
        console.log("API Error:", err);
        return "----"; // fallback
    }
}

// 🎯 Generate shots
function generateShots() {
    let shots = [];

    for (let i = 0; i < 6; i++) {

        let type = Math.random() > 0.5 ? "BIG" : "SMALL";

        let num1, num2;

        if (type.includes("BIG")) {
            num1 = Math.floor(Math.random() * 5) + 5;
            num2 = Math.floor(Math.random() * 5) + 5;
        } else {
            num1 = Math.floor(Math.random() * 5);
            num2 = Math.floor(Math.random() * 5);
        }

        shots.push(
`${i + 1}. ${type} → ${num1}, ${num2}
👉 [Register Here](${link})`
        );
    }

    return shots.join("\n\n");
}

// 📤 Send prediction
async function sendSession(time) {

    const period = await getPeriod();

    const msg = `
🔥 *VIP PREDICTION* 🔥
⏱ *WINGO 1 MINUTE*

🧾 *Period: ${period}*

${generateShots()}

🚀 *NEW USER REGISTER FAST*
`;

    bot.sendMessage(config.channel, msg, { parse_mode: "Markdown" });
}

// 🎯 Send result
function sendResult(period) {
    const isWin = Math.random() > 0.4;

    const msg = isWin
        ? `✅ *RESULT: WIN* 🎉\n🧾 *Period ${period}*`
        : `❌ *RESULT: LOSS*\n🧾 *Period ${period}*`;

    bot.sendMessage(config.channel, msg, { parse_mode: "Markdown" });
}

// 🧠 Track sessions
let sentToday = {};

// 🔁 Scheduler
setInterval(async () => {

    const now = new Date();

    const currentTime =
        now.getHours().toString().padStart(2, '0') + ":" +
        now.getMinutes().toString().padStart(2, '0');

    const today = now.toDateString();

    if (!sentToday[today]) {
        sentToday = {};
    }

    if (sessionTimes.includes(currentTime) && !sentToday[currentTime]) {

        const period = await getPeriod();

        sendSession(currentTime);
        sentToday[currentTime] = true;

        if (resultSessions.includes(currentTime)) {
            setTimeout(() => {
                sendResult(period);
            }, resultDelay);
        }
    }

}, 60000);
