const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
require('dotenv').config()

/**
 * Open web KKU Software License Reservation
 */
async function OpenWebSiteKKUSoftwareLicense() {
  try {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();

    await page.goto(process.env.URL);

    await page.click('button[value="kkumail"]');
    page.waitForNavigation(100, { waitUntil: ['networkidle2', 'domcontentloaded'] })

    const url = page.url();
    console.log(url)
    return { url, page, browser };
  } catch (error) {
    console.log(error);
    await browser.close();
  }
}

/**
 * Fill username and password
 */
async function fillUsernameAndPasswordByUrl() {
  try {
    const { url, page, browser } = await OpenWebSiteKKUSoftwareLicense();

    await page.goto(url);
    await page.type('#LoginForm_username', process.env.USERNAME);
    await page.type('#LoginForm_password', process.env.PASSWORD);
    await page.evaluate((arg) => document.getElementsByName("LoginForm[domain]")[0].value = arg, process.env.DOMAIN);
    await page.click('button[type="submit"]');

    return { page, browser };
  } catch (error) {
    console.log(error);
    await browser.close();
  }
}

/**
 * Selected day of license
 */
async function selectedDayLicense() {
  try {
    const { page, browser } = await fillUsernameAndPasswordByUrl();
    await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] });
    await page.evaluate((arg) => document.getElementsByName("token_duration")[0].value = arg, process.env.DURATION);
    await page.click('button[name="authorize"]');

    const url = page.url();

    return { url, page, browser };
  } catch (error) {
    console.log(error);
    await browser.close();
  }
}

/**
 * Select Adobe Creative Cloud
 */
async function selectedAdobeCreativeCloud() {
  try {
    const { url, page, browser } = await selectedDayLicense();

    page.waitForNavigation(100, { waitUntil: ['networkidle2', 'domcontentloaded'] });
    await page.goto(url);

    if (await page.waitForSelector('.btn-reserve', { timeout: 5000 })) {
      console.log("found .btn-reserve")
      await page.click('.btn-reserve');
    } else console.log("not found");

    // const a = await page.$('.active-container')
    // console.log(a)

    await browser.close();
  } catch (error) {
    console.log(error);
    await browser.close();
  }
}

(async () => {
  try {
    schedule.scheduleJob('*/1 * * * *', async function () {
      await selectedAdobeCreativeCloud()
    });
  } catch (error) {
    console.log(error);
  }
})();

