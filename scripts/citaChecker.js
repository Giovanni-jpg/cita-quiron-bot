const { chromium } = require('playwright');
const { selectProfessional, fillPatientInfo, handleCookies } = require('./steps');
const { getLastDate, saveNewDate, parseDate } = require('../lib/storage');
const { notify } = require('../lib/notify');
const { log } = require('./utils');

module.exports = async function citaChecker() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

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
    log('No previous date found, saving new date...');
    saveNewDate(dateTimeStr);
  } else {
    const newDate = parseDate(dateTimeStr);
    const lastDate = parseDate(lastDateStr);

    if (newDate < lastDate) {
      log('New earlier slot detected! Sending notification...');
      await notify(dateTimeStr);
      saveNewDate(dateTimeStr);
    } else {
      log('No earlier slot found, keeping last date:', lastDateStr);
    }
  }

  await browser.close();
};
