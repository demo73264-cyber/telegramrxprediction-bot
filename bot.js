const TelegramBot = require("node-telegram-bot-api");

// ================= CONFIG =================
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL = "@rajagame_srishti";

// Daily session times (24-hour format, IST)
const DAILY_TIMES = [
  "09:30",
  "11:30",
  "13:00",
  "15:00",
  "17:00",
  "19:30",
  "21:30"
];

// TEST TIME (change anytime)
const TEST_TIME = "05:27";

// How many predictions per session
const SHOTS_PER_SESSION = 6;

// ==========================================

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

// ===== STATE CONTROL =====
let lastPeriod = null;
let sentToday = {}; // track time-based sends

// ===== FETCH PERIOD =====
async function getPeriod() {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getPayload())
    });

    const text = await res.text();

    if (!text.startsWith("{")) {
      console.log("Invalid API response");
      return null;
    }

    const data = JSON.parse(text);
    return data?.data?.issueNumber || null;

  } catch (e) {
    console.log("API ERROR:", e);
    return null;
  }
}

// ===== GENERATE SINGLE RESULT =====
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

// ===== GENERATE FULL MESSAGE =====
function generateMessage(periodLast3) {
  let msg = `🔥 *VIP PREDICTION*\n⌛ *WINGO 1 MINUTE*\n\n📄 Period: ${periodLast3}\n\n`;

  for (let i = 0; i < SHOTS_PER_SESSION; i++) {
    msg += generateSingle() + "\n\n";
  }

  msg += `*REGISTER NOW*\nhttps://www.jaiclub04.com/#/register?invitationCode=376641278237`;

  return msg;
}

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
