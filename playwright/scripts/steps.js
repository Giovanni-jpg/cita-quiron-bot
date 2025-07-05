const { config } = require('../config/constants');
const { log } = require('./utils');

async function handleCookies(page) {
  await page.waitForTimeout(1000 + Math.random() * 1000);
  try {
    const frames = page.frames();
    for (const frame of frames) {
      const btn = await frame.$('#onetrust-accept-btn-handler');
      if (btn) {
        await btn.click({ timeout: 3000 });
        //log('Cookies accepted');
        return;
      }
    }
    log('Cookie button not found in any iframe');
  } catch (e) {
    log('Error handling cookies:', e.message);
  }
}


async function selectProfessional(page) {
  await page.waitForTimeout(1000 + Math.random() * 1000);
  await page.mouse.move(300, 200);
  await page.click('text=Por Profesional');
  await page.waitForTimeout(1000 + Math.random() * 1000);
  await page.locator("[name='professionalSearch']").fill(config.doctor);
  await page.waitForTimeout(1000 + Math.random() * 1000);
  await page.mouse.move(200, 200);
  await page.click(`text=${config.doctor}`);
  await page.waitForTimeout(1000 + Math.random() * 1000);
}

async function fillPatientInfo(page) {
  await page.click('text=Siguiente');
  await page.waitForTimeout(1000 + Math.random() * 1000);
  await page.mouse.move(300, 300);
  await page.click('text=NO, ya estoy en un proceso médico');
  await page.waitForTimeout(1000 + Math.random() * 1000);
  await page.click('text=Consulta Sucesiva');
  await page.waitForTimeout(1000 + Math.random() * 1000);
  await page.mouse.move(200, 300);
  await page.click('text=Telefónica');
  await page.waitForTimeout(1000 + Math.random() * 1000);
  await page.click('text=Siguiente');
  await page.waitForTimeout(1000 + Math.random() * 1000);
  await page.click('text=Tengo seguro médico');
  await page.waitForTimeout(1000 + Math.random() * 1000);
  await page.mouse.move(300, 300);
  await page.click(`text=${config.insurance}`);
  await page.waitForTimeout(1000 + Math.random() * 1000);
  await page.click(`text=${config.insurancePlan}`);
  await page.waitForTimeout(1000 + Math.random() * 1000);
  await page.mouse.move(300, 200);
  await page.click('text=Continuar');
  await page.waitForTimeout(1000 + Math.random() * 1000);
  await page.click(`text=${config.gender}`);
  await page.waitForTimeout(1000 + Math.random() * 1000);
  await page.mouse.move(300, 200);
  await page.locator("[name='edad']").fill(config.age);
  await page.waitForTimeout(1000 + Math.random() * 1000);
  await page.click('text=Ver fechas');
}

module.exports = {
  handleCookies,
  selectProfessional,
  fillPatientInfo,
};
