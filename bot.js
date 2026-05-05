const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const express = require("express");

// 🔹 Bot
const bot = new TelegramBot(config.token, { polling: false });

// 🔹 Server
const app = express();
app.get("/", (req, res) => res.send("Bot running"));
app.listen(3000);

// 🔗 Register link
const link = "https://www.jaiclub04.com/#/register?invitationCode=376641278237";

// ⏱ Daily Times (IST)
const sessionTimes = [
    "09:30",
    "11:30",
    "13:00",
    "15:00",
    "17:00",
    "19:30",
    "21:30"
];

// 🎯 Result sessions
const resultSessions = [
    "13:00",
    "15:00",
    "17:00",
    "19:30",
    "21:30"
];

// 🧪 Test time (change anytime)
const testTime = "00:07";

// ⏱ Delay
const resultDelay = 62000;

// 🌐 API
const API_URL = "https://api.bdg88zf.com/api/webapi/GetGameIssue";

// ✅ Safe Period Fetch
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

        const text = await res.text();

        try {
            const data = JSON.parse(text);
            let issue = data?.data?.issueNumber || "0000";
            return issue.toString().slice(-4);
        } catch {
            return Math.floor(1000 + Math.random() * 9000);
        }

    } catch {
        return Math.floor(1000 + Math.random() * 9000);
    }
}

// 🎯 Generate Shots
function generateShots() {
    let shots = [];

    for (let i = 0; i < 6; i++) {
        let isBig = Math.random() > 0.5;

        let num1 = isBig ? Math.floor(Math.random() * 5) + 5 : Math.floor(Math.random() * 5);
        let num2 = isBig ? Math.floor(Math.random() * 5) + 5 : Math.floor(Math.random() * 5);

        shots.push(
`${i + 1}. ${isBig ? "🔵 BIG" : "🟠 SMALL"} → ${num1}, ${num2}
👉 https://www.jaiclub04.com/#/register?invitationCode=376641278237`
        );
    }

    return shots.join("\n\n");
}

// 📤 Send Prediction
async function sendSession(period) {
    const msg = `
🔥 *VIP PREDICTION* 🔥
⏱ *WINGO 1 MINUTE*

🧾 *Period: ${period}*

${generateShots()}

🚀 *NEW USER REGISTER FAST*
`;

    try {
        await bot.sendMessage(config.channel, msg, { parse_mode: "Markdown" });
    } catch (e) {
        console.log("Send Error:", e.message);
    }
}

// 🎯 Send Result
function sendResult(period) {
    const isWin = Math.random() > 0.4;

    const msg = isWin
        ? `✅ *RESULT: WIN* 🎉\n🧾 *Period ${period}*`
        : `❌ *RESULT: LOSS*\n🧾 *Period ${period}*`;

    bot.sendMessage(config.channel, msg, { parse_mode: "Markdown" });
}

// 🧠 TRACKING (ONLY ONE DECLARATION)
let sentToday = {};
let testSent = false;

// 🔁 MAIN LOOP
setInterval(async () => {

    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const date = new Date(now);

    const currentTime =
        date.getHours().toString().padStart(2, '0') + ":" +
        date.getMinutes().toString().padStart(2, '0');

    const today = date.toDateString();

    // ✅ Ensure date object exists
    if (!sentToday[today]) {
        sentToday[today] = {};
    }

    console.log("Time:", currentTime);

    // 🔹 DAILY SESSIONS
    if (sessionTimes.includes(currentTime) && !sentToday[today][currentTime]) {

        const period = await getPeriod();

        await sendSession(period);
        sentToday[today][currentTime] = true;

        if (resultSessions.includes(currentTime)) {
            setTimeout(() => sendResult(period), resultDelay);
        }
    }

    // 🔹 TEST SESSION (RUN ONCE)
    if (currentTime === testTime && !testSent) {

        const period = await getPeriod();

        await sendSession(period);
        setTimeout(() => sendResult(period), resultDelay);

        testSent = true;
    }

}, 10000); // ⚡ faster check (10 sec)
