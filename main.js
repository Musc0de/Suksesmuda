const fs = require("fs");
const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");
const cheerio = require("cheerio");
require("dotenv").config();
const { faker } = require("@faker-js/faker");
const { CookieJar } = require("tough-cookie");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Konfigurasi Dasar Proxy
const PROXY_CONFIG = {
  host: process.env.PROXY_HOST,
  port: parseInt(process.env.PROXY_PORT),
  baseUsername: process.env.PROXY_USERNAME,
  password: process.env.PROXY_PASSWORD,
  lifetime: parseInt(process.env.PROXY_LIFETIME),
};

// Fungsi pembuatan proxy agent
function createNewProxyAgent() {
  const sessionId = Date.now().toString().slice(-6);
  const username = `${PROXY_CONFIG.baseUsername}-session-${sessionId}`;
  return new HttpsProxyAgent({
    host: PROXY_CONFIG.host,
    port: PROXY_CONFIG.port,
    auth: `${username}:${PROXY_CONFIG.password}`,
    rejectUnauthorized: false,
  });
}

// Baca dan normalisasi URL
const URL_LIST = fs
  .readFileSync("url.txt", "utf-8")
  .split("\n")
  .filter((url) => {
    try {
      new URL(url.trim());
      return true;
    } catch {
      return false;
    }
  })
  .map((url) => {
    const u = new URL(url.trim());
    u.hash = "";
    u.search = "";
    return u.href;
  });

// Generator Fingerprint Browser
function generateBrowserFingerprint() {
  return {
    userAgent: faker.internet.userAgent(),
    acceptLanguage: "en-US,en;q=0.9", // Tetap ke bahasa Inggris
    screen: {
      width: faker.datatype.number({ min: 360, max: 1920 }),
      height: faker.datatype.number({ min: 640, max: 1080 }),
    },
    hardwareConcurrency: faker.helpers.arrayElement([2, 4, 8]),
  };
}

// Simulasi Scroll dengan pembatasan path
async function simulateScroll(pageHeight, currentUrl) {
  const basePath = new URL(currentUrl).pathname;
  let position = 0;

  while (position < pageHeight) {
    const scrollAmount = faker.datatype.number({ min: 200, max: 800 });
    position = Math.min(position + scrollAmount, pageHeight);
    console.log(`🖱 Scroll ke posisi: ${position}px [${basePath}]`);
    await sleep(faker.datatype.number({ min: 500, max: 2000 }));
  }
}

// Simulasi Klik dengan filter ketat
async function simulateSafeClicks($, currentUrl) {
  const currentDomain = new URL(currentUrl).hostname;
  const basePath = new URL(currentUrl).pathname;

  const allowedLinks = $("a")
    .map((i, el) => {
      try {
        const href = $(el).attr("href");
        if (!href) return null;

        const absoluteUrl = new URL(href, currentUrl);
        absoluteUrl.hash = "";
        absoluteUrl.search = "";

        // Hanya izinkan URL yang ada di URL_LIST
        if (URL_LIST.includes(absoluteUrl.href)) {
          return absoluteUrl.href;
        }
      } catch (e) {
        return null;
      }
    })
    .get()
    .filter(Boolean);

  if (allowedLinks.length > 0) {
    const numClicks = faker.datatype.number({ min: 1, max: 2 });
    for (let i = 0; i < numClicks; i++) {
      const target = faker.helpers.arrayElement(allowedLinks);
      console.log(`🔗 Klik ke: ${target.substring(0, 60)}...`);
      await sleep(faker.datatype.number({ min: 1000, max: 3000 }));
    }
  }
}

class StrictTabManager {
  constructor() {
    this.tabs = [];
    this.activeTab = 0;
  }

  newTab() {
    const newUrl = faker.helpers.arrayElement(URL_LIST);
    this.tabs.push({
      url: newUrl,
      history: [],
      cookies: new CookieJar(),
    });
    console.log(`➕ Tab baru: ${newUrl.substring(0, 50)}...`);
  }
}

async function visitArticle(url, tabManager) {
  const cookieJar = new CookieJar();
  const fingerprint = generateBrowserFingerprint();
  const currentUrl = new URL(url);

  try {
    const agent = createNewProxyAgent();
    const axiosInstance = axios.create({
      httpsAgent: agent,
      headers: {
        "User-Agent": fingerprint.userAgent,
        "Accept-Language": fingerprint.acceptLanguage,
        Referer: "https://www.google.com/", // Selalu dari Google
        "Viewport-Width": fingerprint.screen.width.toString(),
      },
      jar: cookieJar,
      timeout: 15000,
    });

    console.log(`\n🌐 [SESSION] ${currentUrl.href}`);
    console.log(`📱 ${fingerprint.userAgent}`);

    // Delay realistis sebelum akses
    await sleep(faker.datatype.number({ min: 1000, max: 5000 }));

    const response = await axiosInstance.get(currentUrl.href);
    const $ = cheerio.load(response.data);

    // Simulasi interaksi
    await simulateScroll(faker.datatype.number({ min: 2000, max: 8000 }), currentUrl.href);
    await simulateSafeClicks($, currentUrl.href);

    // Simulasi waktu baca
    const content = $("article").text() || $("body").text();
    await simulateReading(content.length);

    console.log(`✅ Selesai: ${currentUrl.href.substring(0, 50)}...\n`);
  } catch (error) {
    console.error(`❌ ERROR: ${error.message}`);
    console.log("🔄 Retry dalam 15-30 detik...");
    await sleep(faker.datatype.number({ min: 15000, max: 30000 }));
    return visitArticle(url, tabManager);
  }
}

async function simulateReading(contentLength) {
  const baseTime = Math.min(contentLength * 50, 300000); // 50ms per karakter
  const totalTime = baseTime * faker.datatype.float({ min: 0.8, max: 1.2 });

  console.log(`📖 Membaca selama ${Math.round(totalTime / 1000)} detik`);

  let elapsed = 0;
  while (elapsed < totalTime) {
    const chunk = faker.datatype.number({ min: 5000, max: 15000 });
    await sleep(chunk);
    elapsed += chunk;

    if (Math.random() > 0.9) {
      console.log("⏸️ Jeda melihat konten...");
      await sleep(faker.datatype.number({ min: 2000, max: 5000 }));
    }
  }
}

async function main() {
  console.log("🤖 Memulai Bot - Google Visitor Simulation");
  console.log(`📁 Target URL: ${URL_LIST.length}`);

  const tabManager = new StrictTabManager();

  for (const [index, url] of URL_LIST.entries()) {
    console.log(`\n📂 Progress: ${index + 1}/${URL_LIST.length}`);
    await visitArticle(url, tabManager);

    // Jeda antar URL
    await sleep(
      faker.datatype.number({
        min: 10000,
        max: 30000,
        precision: 1000,
      })
    );
  }

  console.log("\n🎉 Simulasi pengunjung Google selesai!");
}

main().catch(console.error);
