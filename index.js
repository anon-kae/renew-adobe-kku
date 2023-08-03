const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
require('dotenv').config()

let browser = null;
/**
 * Open web KKU Software License Reservation
 */
async function OpenWebSiteKKUSoftwareLicense() {
  try {
    browser = await puppeteer.launch({
      // headless: false,
      // executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto(process.env.URL);

    await page.click('button[value="kkumail"]');
    page.waitForNavigation(100, { waitUntil: ['networkidle2', 'domcontentloaded'] })

    const url = page.url();
    console.log(url)
    console.log('Running to Open web KKU Software License Reservation')
    return { url, page };
  } catch (error) {
    console.log(error);
    await browser?.close();
  }
}

/**
 * Fill username and password
 */
async function fillUsernameAndPasswordByUrl() {
  try {
    const { url, page } = await OpenWebSiteKKUSoftwareLicense();

    await page.goto(url);
    await page.waitForSelector('#LoginForm_username', { visible:true });
    await page.type('#LoginForm_username', process.env.USERNAME);
    await page.waitForSelector('#LoginForm_password', { visible:true });
    await page.type('#LoginForm_password', process.env.PASSWORD);
    await page.evaluate((arg) => document.getElementsByName("LoginForm[domain]")[0].value = arg, process.env.DOMAIN);
    await page.click('button[type="submit"]');

    console.log('Running to Fill username and password')
    return { page };
  } catch (error) {
    console.log(error);
    await browser?.close();
  }
}

/**
 * Selected day of license
 */
async function selectedDayLicense() {
  try {
    const { page } = await fillUsernameAndPasswordByUrl();
    await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] });
    await page.evaluate((arg) => document.getElementsByName("token_duration")[0].value = arg, process.env.DURATION);
    await page.click('button[name="authorize"]');

    const url = page.url();

    console.log('Running to Selected day of license')
    return { url, page };
  } catch (error) {
    console.log(error);
    await browser?.close();
  }
}

/**
 * Select Adobe Creative Cloud
 */
async function selectedAdobeCreativeCloud() {
  try {
    const { url, page } = await selectedDayLicense();

    page.waitForNavigation(100, { waitUntil: ['networkidle2', 'domcontentloaded'] });
    await page.goto(url);

    if (await page.waitForSelector('.btn-reserve', { timeout: 5000 })) {
      console.log("found .btn-reserve")
      await page.click('.btn-reserve');
    } else console.log("not found");

    // const a = await page.$('.active-container')
    // console.log(a)
    console.log('Running to Select Adobe Creative Cloud')
    await browser?.close();
  } catch (error) {
    console.log(error);
    await browser?.close();
  }
}

(async () => {
  try {
    console.log('running to starting')
    schedule.scheduleJob('*/1 * * * *', async function () {
      await selectedAdobeCreativeCloud()
    });
  } catch (error) {
    console.log(error);
  }
})();

