const puppeteer = require("puppeteer");
require("dotenv").config();

async function login(browser, page, url) {
  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    // fill username
    await page.waitForSelector("#LoginForm_username", { visible: true });
    await page.type("#LoginForm_username", process.env.USERNAME);

    // select domain
    await page.select("select[name='LoginForm[domain]']", process.env.DOMAIN);

    // fill password
    await page.waitForSelector("#LoginForm_password", { visible: true });
    await page.type("#LoginForm_password", process.env.PASSWORD);

    await page.click('button[type="submit"]');
    console.log("Successfully filled in username and password");
  } catch (error) {
    await browser.close();
  }
}

async function openWebSiteKKUSoftwareLicense(browser, page) {
  try {
    await page.goto(process.env.URL, {
      waitUntil: "domcontentloaded",
    });

    await page.click('button[value="kkumail"]');
    console.log("Successfully opened KKU Software License website");

    return { url: page.url() };
  } catch (error) {
    console.log("Not found KKU Software License website");
    await browser.close();
  }
}

async function selectedDayLicense(browser, page) {
  try {
    await page.waitForNavigation({ waitUntil: ["load", "networkidle2"] });
    await page.select("select[name='token_duration']", process.env.DURATION);
    await page.click('button[name="authorize"]');
    console.log("Successfully selected day license");
    return { url: page.url() };
  } catch (error) {
    console.log("Not found day license");
    await browser.close();
  }
}

async function selectedAdobeCreativeCloud(browser, page, url) {
  try {
    await page.goto(url);
    await page.waitForSelector(".button.btn-reserve", { timeout: 5000 });
    await page.click(".button.btn-reserve");
    console.log("Successfully selected Adobe Creative Cloud");
  } catch (error) {
    console.log("Not found Adobe Creative Cloud");
    await browser.close();
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: "new",
    // executablePath: "/usr/bin/google-chrome",
    // args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // open website KKU Software License
  const kkuLicense = await openWebSiteKKUSoftwareLicense(browser, page);
  // login
  await login(browser, page, kkuLicense.url);
  // select day license
  const dayLicense = await selectedDayLicense(browser, page);
  // select Adobe Creative Cloud
  await selectedAdobeCreativeCloud(browser, page, dayLicense.url);

  // Reserve license
  try {
    const button = await page.$("button#btn_reserve.btn-reserve");
    if (button) {
      await page.click("#btn_reserve.btn-reserve");
      await browser.close();
      console.log("Reserve license successfully.");
    } else {
      await browser.close();
      console.log("Button Reserve not found bot will try again.");
    }
  } catch (e) {
    await browser.close();
    console.log("Button Reserve not found bot will try again.");
  }
}

(async () => {
  console.log("Bot started, wait for every 1 minute to start the process.");
  setInterval(async () => {
    console.log("Started process reserve license.");
    await main();
  }, 60000);
})();
