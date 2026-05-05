const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const express = require("express");

// 🔹 Bot
const bot = new TelegramBot(config.token, { polling: false });

// 🔹 Server (Railway keep alive)
const app = express();
app.get("/", (req, res) => res.send("Bot running"));
app.listen(3000);

// 🔗 Register link
const link = "https://www.jaiclub04.com/#/register?invitationCode=376641278237";

// ⏱ DAILY TIMES (IST)
const sessionTimes = [
    "09:30",
    "11:30",
    "13:00",
    "15:00",
    "17:00",
    "19:30",
    "21:30"
];

// 🎯 Sessions with auto result
const resultSessions = [
    "13:00",
    "15:00",
    "17:00",
    "19:30",
    "21:30"
];

// 🧪 TODAY TEST TIME (only once)
const testTime = "14:49";

// ⏱ Result delay (62 sec)
const resultDelay = 62000;

// 🌐 API
const API_URL = "https://api.bdg88zf.com/api/webapi/GetGameIssue";

async function getPeriod() {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                typeId: 1,
                language: 0,
                random: "40079dcba93a48769c6ee9d4d4fae23f",
                signature: "D12108C4F57C549D82B23A91E0FA20AE",
                timestamp: Math.floor(Date.now() / 1000)
            })
        });

        const data = await res.json();
        let issue = data?.data?.issueNumber || "0000";
        return issue.toString().slice(-4);

    } catch (e) {
        console.log("API Error:", e);
        return "----";
    }
}

// 🎯 Shots
function generateShots() {
    let shots = [];

    for (let i = 0; i < 6; i++) {
        let type = Math.random() > 0.5 ? "🔵 BIG" : "🟠 SMALL";

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

// 📤 Prediction
async function sendSession(period) {
    const msg = `
🔥 *VIP PREDICTION* 🔥
⏱ *WINGO 1 MINUTE*

🧾 *Period: ${period}*

${generateShots()}

🚀 *NEW USER REGISTER FAST*
`;

    bot.sendMessage(config.channel, msg, { parse_mode: "Markdown" });
}

// 🎯 Result
function sendResult(period) {
    const isWin = Math.random() > 0.4;

    const msg = isWin
        ? `✅ *RESULT: WIN* 🎉\n🧾 *Period ${period}*`
        : `❌ *RESULT: LOSS*\n🧾 *Period ${period}*`;

    bot.sendMessage(config.channel, msg, { parse_mode: "Markdown" });
}

// 🧠 Tracking
let sentToday = {};
let testSent = false;

// 🔁 MAIN LOOP
setInterval(async () => {

    // ✅ IST TIME
    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const date = new Date(now);

    const currentTime =
        date.getHours().toString().padStart(2, '0') + ":" +
        date.getMinutes().toString().padStart(2, '0');

    const today = date.toDateString();

    if (!sentToday[today]) {
        sentToday = {};
    }

    console.log("Time:", currentTime);

    // 🔹 DAILY SESSIONS
    if (sessionTimes.includes(currentTime) && !sentToday[currentTime]) {

        const period = await getPeriod();

        sendSession(period);
        sentToday[currentTime] = true;

        if (resultSessions.includes(currentTime)) {
            setTimeout(() => sendResult(period), resultDelay);
        }
    }

    // 🔹 TODAY TEST (ONLY ONCE)
    if (currentTime === testTime && !testSent) {
        const period = await getPeriod();

        sendSession(period);

        setTimeout(() => sendResult(period), resultDelay);

        testSent = true;
    }

}, 60000);// 🎯 Send result
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
