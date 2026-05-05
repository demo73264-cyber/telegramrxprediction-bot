const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const express = require("express");

// 🔹 Bot init
const bot = new TelegramBot(config.token, { polling: false });

// 🔹 Keep Railway alive
const app = express();
app.get("/", (req, res) => res.send("Bot running"));
app.listen(3000);

// 🔗 Link
const link = "https://www.jaiclub04.com/#/register?invitationCode=376641278237";

// ⏱ Times (IST)
const sessionTimes = [
    "09:30",
    "11:30",
    "13:00",
    "15:00",
    "17:00",
    "19:30",
    "21:30"
];

// 🧪 Test time (change anytime)
const testTime = "00:23";

// 🌐 API
const API_URL = "https://api.bdg88zf.com/api/webapi/GetGameIssue";

// 🧠 TRACKING (only once)
let sentToday = {};
let testSent = false;

// ✅ SAFE PERIOD (last 3 digits)
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
            let issue = data?.data?.issueNumber || "000";
            return issue.toString().slice(-3);
        } catch {
            return Math.floor(100 + Math.random() * 900);
        }

    } catch {
        return Math.floor(100 + Math.random() * 900);
    }
}

// 🎯 SINGLE SHOT (NO SAME NUMBER + BOLD FORMAT)
function generateOneShot() {

    let isBig = Math.random() > 0.5;
    let num1, num2;

    if (isBig) {
        num1 = Math.floor(Math.random() * 5) + 5;
        do {
            num2 = Math.floor(Math.random() * 5) + 5;
        } while (num1 === num2);
    } else {
        num1 = Math.floor(Math.random() * 5);
        do {
            num2 = Math.floor(Math.random() * 5);
        } while (num1 === num2);
    }

    return `**BET ON = ${isBig ? "BIG" : "SMALL"} → ${num1}, ${num2}**`;
}

// 📤 SEND MULTIPLE MESSAGES (6–8 TIMES)
async function sendSession(period) {

    const totalShots = 6; // change to 7 or 8 if needed

    for (let i = 0; i < totalShots; i++) {

        const msg = `
🔥 VIP PREDICTION 🔥
⏱ WINGO 1 MINUTE

🧾 Period: ${period}
${generateOneShot()}

**REGISTER NOW**
${link}
`;

        try {
            await bot.sendMessage(config.channel, msg, {
                parse_mode: "Markdown"
            });
        } catch (e) {
            console.log("Send Error:", e.message);
        }

        // delay between each message (2 sec)
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

// 🔁 MAIN LOOP (FAST + STABLE)
setInterval(async () => {

    try {

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

        // 🔹 DAILY
        if (sessionTimes.includes(currentTime) && !sentToday[today][currentTime]) {

            const period = await getPeriod();
            await sendSession(period);

            sentToday[today][currentTime] = true;
        }

        // 🔹 TEST (only once)
        if (currentTime === testTime && !testSent) {

            const period = await getPeriod();
            await sendSession(period);

            testSent = true;
        }

    } catch (err) {
        console.log("Loop Error:", err.message);
    }

}, 10000); // check every 10 sec
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
