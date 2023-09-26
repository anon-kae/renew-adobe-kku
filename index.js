const puppeteer = require('puppeteer');
require('dotenv').config()

let browser = null;

async function initializeBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
  }
}

async function OpenWebSiteKKUSoftwareLicense() {
  await initializeBrowser();
  const page = await browser.newPage();

  await page.goto(process.env.URL, { timeout: 6000 });

  await page.click('button[value="kkumail"]');

  const url = page.url();
  return { url, page };
}

async function fillUsernameAndPasswordByUrl() {
  const { url, page } = await OpenWebSiteKKUSoftwareLicense();

  await page.goto(url);
  await page.waitForSelector('#LoginForm_username', { visible: true });
  await page.type("#LoginForm_username", process.env.USERNAME);
  await page.waitForSelector('#LoginForm_password', { visible: true });
  await page.type("#LoginForm_password", process.env.PASSWORD);
  await page.select("select[name='LoginForm[domain]']", process.env.DOMAIN);
  await page.click('button[type="submit"]');
  console.log('Successfully filled in username and password')
  return { page };
}

async function selectedDayLicense() {
  const { page } = await fillUsernameAndPasswordByUrl();
  await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] });
  await page.select("select[name='token_duration']", process.env.DURATION);
  await page.click('button[name="authorize"]');
  console.log('Successfully selected day license')
  const url = page.url();
  return { url, page };
}

async function selectedAdobeCreativeCloud() {
  const { url, page } = await selectedDayLicense();

  await page.waitForNavigation({ waitUntil: ['networkidle2', 'domcontentloaded'] });
  await page.goto(url, { waitUntil: ['networkidle2', 'domcontentloaded'] });

  try {
    await page.waitForSelector('.btn-reserve', { timeout: 5000 });
    await page.click('.btn-reserve');
  } catch (e) {
    console.log("Button .btn-reserve not found");
  }
}

(async () => {
  console.log('Starting...');
  setInterval(async () => {
    try {
      await selectedAdobeCreativeCloud();
      console.log('Successfully completed a cycle.');
    } catch (error) {
      console.error('Error during execution:', error);
    } finally {
      await browser.close();
      browser = null;  // Reset the browser instance for the next cycle
    }
  }, 1000 * 60);
})();
