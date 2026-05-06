const TelegramBot = require("node-telegram-bot-api");

// ===== CONFIG =====
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL = "@rajagame_srishti";

const TEST_TIME = "05:35"; // ✅ IST time

const SHOTS_PER_SESSION = 6;

// ===== INIT =====
const bot = new TelegramBot(BOT_TOKEN);

// ===== API =====
const API_URL = "https://api.bdg88zf.com/api/webapi/GetGameIssue";

function getPayload() {
  return {
    typeId: 1,
    language: 0,
    random: "40079dcba93a48769c6ee9d4d4fae23f",
    signature: "D12108C4F57C549D82B23A91E0FA20AE",
    timestamp: Math.floor(Date.now() / 1000)
  };
}

// ===== STATE =====
let lastPeriod = null;
let testSent = false;

// ===== FETCH PERIOD =====
async function getPeriod() {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(getPayload())
    });

    const text = await res.text();

    // Prevent crash if API returns HTML
    if (!text || !text.startsWith("{")) {
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

// ===== GENERATE SINGLE =====
function generateSingle() {
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

  return `*BET ON = ${isBig ? "BIG" : "SMALL"} ${n1}, ${n2}*`;
}

// ===== GENERATE MESSAGE =====
function generateMessage(periodLast3) {
  let msg = `🔥 *VIP PREDICTION*\n⌛ *WINGO 1 MINUTE*\n\n📄 Period: ${periodLast3}\n\n`;

  for (let i = 0; i < SHOTS_PER_SESSION; i++) {
    msg += generateSingle() + "\n\n";
  }

  msg += `*REGISTER NOW*\nhttps://www.jaiclub04.com/#/register?invitationCode=376641278237`;

  return msg;
}

// ===== SEND =====
async function sendPrediction() {
  const fullPeriod = await getPeriod();

  if (!fullPeriod) return;

  // prevent duplicate
  if (fullPeriod === lastPeriod) return;

  lastPeriod = fullPeriod;

  const last3 = fullPeriod.slice(-3);

  const message = generateMessage(last3);

  try {
    await bot.sendMessage(CHANNEL, message, {
      parse_mode: "Markdown"
    });

    console.log("✅ Sent for period:", fullPeriod);

  } catch (err) {
    console.log("❌ Telegram Error:", err.message);
  }
}

// ===== TIME LOOP (IST FIXED) =====
setInterval(() => {

  // ✅ IST TIME FIX
  const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const date = new Date(now);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const currentTime = `${hours}:${minutes}`;

  console.log("Time:", currentTime);

  // ===== TEST TRIGGER =====
  if (!testSent && currentTime === TEST_TIME) {
    console.log("🚀 TEST TRIGGER");
    sendPrediction();
    testSent = true;
  }

}, 10000);
// ===== SEND =====
async function sendPrediction(triggerLabel) {
  const fullPeriod = await getPeriod();
  if (!fullPeriod) return;

  if (fullPeriod === lastPeriod) {
    console.log("Already sent for this period");
    return;
  }

  lastPeriod = fullPeriod;

  const last3 = fullPeriod.slice(-3);
  const message = generateMessage(last3);

  await bot.sendMessage(CHANNEL, message, {
    parse_mode: "Markdown"
  });

  console.log(`Sent (${triggerLabel}) for period:`, fullPeriod);
}

// ===== TIME LOOP =====
setInterval(() => {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const currentTime = `${hours}:${minutes}`;

  console.log("Time:", currentTime);

  // ===== TEST =====
  if (!sentToday["TEST"] && currentTime === TEST_TIME) {
    sendPrediction("TEST");
    sentToday["TEST"] = true;
  }

  // ===== DAILY SESSIONS =====
  DAILY_TIMES.forEach((time) => {
    if (!sentToday[time] && currentTime === time) {
      sendPrediction(time);
      sentToday[time] = true;
    }
  });

  // ===== RESET DAILY AT MIDNIGHT =====
  if (currentTime === "00:00") {
    sentToday = {};
    console.log("Reset daily schedule");
  }

}, 60000);
