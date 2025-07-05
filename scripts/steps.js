const { config } = require('../config/constants');
const { log } = require('./utils');

async function handleCookies(page) {
  try {
    const frames = page.frames();
    for (const frame of frames) {
      const btn = await frame.$('#onetrust-accept-btn-handler');
      if (btn) {
        await btn.click({ timeout: 3000 });
        log('Cookies accepted');
        return;
      }
    }
    log('Cookie button not found in any iframe');
  } catch (e) {
    log('Error handling cookies:', e.message);
  }
}


async function selectProfessional(page) {
  await page.click('text=Por Profesional');
  await page.locator("[name='professionalSearch']").fill(config.doctor);
  await page.click(`text=${config.doctor}`);
}

async function fillPatientInfo(page) {
  await page.click('text=Siguiente');
  await page.click('text=NO, ya estoy en un proceso médico');
  await page.click('text=Consulta Sucesiva');
  await page.click('text=Telefónica');
  await page.click('text=Siguiente');
  await page.click('text=Tengo seguro médico');
  await page.click(`text=${config.insurance}`);
  await page.click(`text=${config.insurancePlan}`);
  await page.click('text=Continuar');
  await page.click(`text=${config.gender}`);
  await page.locator("[name='edad']").fill(config.age);
  await page.click('text=Ver fechas');
}

module.exports = {
  handleCookies,
  selectProfessional,
  fillPatientInfo,
};
