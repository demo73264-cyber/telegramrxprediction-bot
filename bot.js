const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");

// ====== CONFIG ======
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL = "@rajagame_srishti";

const bot = new TelegramBot(BOT_TOKEN);

// ====== API ======
const API_URL = "https://api.bdg88zf.com/api/webapi/GetGameIssue";

const API_PAYLOAD = {
    typeId: 1,
    language: 0,
    random: "40079dcba93a48769c6ee9d4d4fae23f",
    signature: "D12108C4F57C549D82B23A91E0FA20AE",
    timestamp: Math.floor(Date.now() / 1000)
};

// ====== CONTROL ======
let lastPeriod = null;
let testSent = false;

// ====== GET PERIOD FROM API ======
async function getPeriod() {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(API_PAYLOAD)
        });

        const text = await res.text();

        // Prevent crash if API returns HTML
        if (!text.startsWith("{")) {
            console.log("❌ Invalid API response");
            return null;
        }

        const data = JSON.parse(text);

        return data?.data?.issueNumber || null;

    } catch (err) {
        console.log("API ERROR:", err);
        return null;
    }
}

// ====== GENERATE 6 PREDICTIONS IN 1 MESSAGE ======
function generatePredictions(periodLast3) {

    let msg = `🔥 *VIP PREDICTION*\n⌛ *WINGO 1 MINUTE*\n\n📄 Period: ${periodLast3}\n\n`;

    for (let i = 1; i <= 6; i++) {

        const isBig = Math.random() > 0.5;

        let n1, n2;

        if (isBig) {
            n1 = Math.floor(Math.random() * 5) + 5;
            do {
                n2 = Math.floor(Math.random() * 5) + 5;
            } while (n1 === n2);
        } else {
            n1 = Math.floor(Math.random() * 5);
            do {
                n2 = Math.floor(Math.random() * 5);
            } while (n1 === n2);
        }

        msg += `*BET ON = ${isBig ? "BIG" : "SMALL"} ${n1}, ${n2}*\n\n`;
    }

    msg += `\n*REGISTER NOW*\nhttps://www.jaiclub04.com/#/register?invitationCode=376641278237`;

    return msg;
}

// ====== SEND FUNCTION ======
async function sendPrediction() {

    const fullPeriod = await getPeriod();

    if (!fullPeriod) return;

    // STOP DUPLICATE SEND
    if (fullPeriod === lastPeriod) return;

    lastPeriod = fullPeriod;

    const last3 = fullPeriod.slice(-3);

    const message = generatePredictions(last3);

    bot.sendMessage(CHANNEL, message, {
        parse_mode: "Markdown"
    });

    console.log("✅ Sent for period:", fullPeriod);
}

// ====== TIME CHECK LOOP ======
setInterval(() => {

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const currentTime = `${hours}:${minutes}`;

    console.log("Time:", currentTime);

    // ===== TEST TIME =====
    const testTime = "05:19";

    if (!testSent && currentTime === testTime) {
        console.log("🚀 TEST TRIGGER");
        sendPrediction();
        testSent = true;
    }

}, 10000);
