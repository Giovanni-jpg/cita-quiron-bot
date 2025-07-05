const { chromium } = require('playwright');
const { selectProfessional, fillPatientInfo, handleCookies } = require('./steps');
const { getLastDate, saveNewDate } = require('../lib/storage');
const { notify } = require('../lib/notify');
const { log } = require('./utils');

const userAgentStrings = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.2227.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.3497.92 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
];


module.exports = async function citaChecker() {
  log('========== Cita Quiron Bot Job Started ==========');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: userAgentStrings[Math.floor(Math.random() * userAgentStrings.length)],
  });
  await context.addInitScript("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
  const page = await context.newPage();

  await page.goto('https://www.quironsalud.com/es/cita-medica#r!/n!/1?dir=none');
  await page.waitForLoadState('networkidle');

  await handleCookies(page);
  await selectProfessional(page);
  await fillPatientInfo(page);

  const firstGap = await page.locator('.hour-button.isFirstGap').first();
  const hourId = await firstGap.getAttribute('id');

  const dateTimeStr = hourId.slice(20); // "25/07/2025_12:45"
  log('First slot found', dateTimeStr);

  const lastDateStr = getLastDate();
  if (!lastDateStr) {
    log('No data found in lastAppointment.txt, saving this slot as the earliest one...');
    saveNewDate(dateTimeStr);
  } else {

    if (dateTimeStr < lastDateStr) {
      log('This slot is earlier than the previously saved one! Sending notification...');
      await notify(dateTimeStr);
      saveNewDate(dateTimeStr);
    } else {
      log('This slot is not earlier than the previously saved one:', lastDateStr);
    }
  }
  await browser.close();
};
