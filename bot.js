const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const express = require("express");

// 🔹 Bot
const bot = new TelegramBot(config.token, { polling: false });

// 🔹 Server (Railway keep alive)
const app = express();
app.get("/", (req, res) => res.send("Bot running"));
app.listen(3000);

// 🔗 Link
const link = "https://www.jaiclub04.com/#/register?invitationCode=376641278237";

// ⏱ Times
const sessionTimes = [
    "09:30",
    "11:30",
    "13:00",
    "15:00",
    "17:00",
    "19:30",
    "21:30"
];

// 🧪 Test time
const testTime = "05:00";

// 🌐 API
const API_URL = "https://api.bdg88zf.com/api/webapi/GetGameIssue";

// 🧠 Tracking
let sentToday = {};
let testSent = false;

// ✅ Get last 3 digits of period
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

// 🎯 Generate one result (NO SAME NUMBER)
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

    return `*BET ON = ${isBig ? "BIG" : "SMALL"} → ${num1}, ${num2}*`;
}

// 📤 Send multiple messages (6 times)
async function sendSession(period) {

    const totalShots = 6;

    for (let i = 0; i < totalShots; i++) {

        const msg = `
🔥 VIP PREDICTION 🔥
⏱ WINGO 1 MINUTE

🧾 Period: ${period}
${generateOneShot()}

*REGISTER NOW*
${link}
`;

        try {
            await bot.sendMessage(config.channel, msg, {
                parse_mode: "Markdown"
            });
        } catch (e) {
            console.log("Send Error:", e.message);
        }

        // delay between messages
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

// 🔁 Main loop
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

        // 🔹 Daily run
        if (sessionTimes.includes(currentTime) && !sentToday[today][currentTime]) {

            const period = await getPeriod();
            await sendSession(period);

            sentToday[today][currentTime] = true;
        }

        // 🔹 Test run
        if (currentTime === testTime && !testSent) {

            const period = await getPeriod();
            await sendSession(period);

            testSent = true;
        }

    } catch (err) {
        console.log("Loop Error:", err.message);
    }

}, 64000); // check every 64 sec
