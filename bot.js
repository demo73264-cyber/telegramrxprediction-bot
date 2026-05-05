const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const express = require("express");

// 🔹 Bot
const bot = new TelegramBot(config.token, { polling: false });

// 🔹 Server
const app = express();
app.get("/", (req, res) => res.send("Bot running"));
app.listen(3000);

// 🔗 Link
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

// 🧪 Test time
const testTime = "15:34";

// ⏱ Delay
const resultDelay = 62000;

// 🌐 API
const API_URL = "https://api.bdg88zf.com/api/webapi/GetGameIssue";

// ✅ SAFE PERIOD FUNCTION (NO CRASH)
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
            console.log("API returned non-JSON");
            return Math.floor(1000 + Math.random() * 9000);
        }

    } catch (e) {
        console.log("API Error:", e);
        return Math.floor(1000 + Math.random() * 9000);
    }
}

// 🎯 Generate shots
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

// 🔁 LOOP
setInterval(async () => {

    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const date = new Date(now);

    const currentTime =
        date.getHours().toString().padStart(2, '0') + ":" +
        date.getMinutes().toString().padStart(2, '0');

    const today = date.toDateString();

    if (!sentToday[today]) {
        sentToday[today] = {};
    }

    console.log("Time:", currentTime);

    // 🔹 Daily sessions
    if (sessionTimes.includes(currentTime) && !sentToday[today][currentTime]) {

        const period = await getPeriod();

        await sendSession(period);
        sentToday[today][currentTime] = true;

        if (resultSessions.includes(currentTime)) {
            setTimeout(() => sendResult(period), resultDelay);
        }
    }

    // 🔹 Test session
    if (currentTime === testTime && !testSent) {

        const period = await getPeriod();

        await sendSession(period);
        setTimeout(() => sendResult(period), resultDelay);

        testSent = true;
    }

}, 60000);

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

// 🧠 Tracking (ONLY ONCE)
let sentToday = {};
let testSent = false;

// 🔁 LOOP
setInterval(async () => {

    // IST TIME
    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const date = new Date(now);

    const currentTime =
        date.getHours().toString().padStart(2, '0') + ":" +
        date.getMinutes().toString().padStart(2, '0');

    const today = date.toDateString();

    if (!sentToday[today]) {
        sentToday[today] = {};
    }

    console.log("Time:", currentTime);

    // 🔹 Daily
    if (sessionTimes.includes(currentTime) && !sentToday[today][currentTime]) {

        const period = await getPeriod();

        await sendSession(period);
        sentToday[today][currentTime] = true;

        if (resultSessions.includes(currentTime)) {
            setTimeout(() => sendResult(period), resultDelay);
        }
    }

    // 🔹 Test (15:34 only once)
    if (currentTime === testTime && !testSent) {

        const period = await getPeriod();

        await sendSession(period);
        setTimeout(() => sendResult(period), resultDelay);

        testSent = true;
    }

}, 60000);
