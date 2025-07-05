const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const STORAGE_FILE = path.join(__dirname, 'lastAppointment.txt');

// Fonction pour envoyer un mail
async function sendMail(dateTime) {
  // let transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: 'ton.email@gmail.com',
  //     pass: 'ton_mdp_app_specifique' // Utilise un mot de passe d'application, pas ton vrai mdp
  //   }
  // });

  // let info = await transporter.sendMail({
  //   from: '"Alerte RDV" <ton.email@gmail.com>',
  //   to: 'destinataire@example.com',
  //   subject: 'Nouveau créneau RDV plus tôt dispo !',
  //   text: `Un nouveau rendez-vous plus tôt est disponible : ${dateTime}\nFonce réserver !`
  // });

  console.log('Mail envoyé:', dateTime);
}

// Fonction pour récupérer la dernière date stockée
function getLastDate() {
  if (!fs.existsSync(STORAGE_FILE)) return null;
  return fs.readFileSync(STORAGE_FILE, 'utf-8').trim();
}

// Fonction pour enregistrer la nouvelle date
function saveNewDate(date) {
  fs.writeFileSync(STORAGE_FILE, date);
}

// Convertir le format "25/07/2025_12:45" en objet Date pour comparaison
function parseDate(dateStr) {
  // dateStr format: "DD/MM/YYYY_HH:mm"
  const [datePart, timePart] = dateStr.split('_');
  const [day, month, year] = datePart.split('/');
  return new Date(`${year}-${month}-${day}T${timePart}:00`);
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.quironsalud.com/es/cita-medica#r!/n!/1?dir=none');

  // Attendre qu’un iframe apparaisse
  const frames = page.frames();

  // Attendre un petit moment que l'iframe se charge
  await page.waitForTimeout(3000);

  // Tenter de cliquer sur "Aceptar cookies" dans les iframes
  for (const frame of frames) {
    try {
      const accept = frame.locator("#onetrust-accept-btn-handler");
      if (await accept.isVisible({ timeout: 2000 })) {
        await accept.click();
        break;
      }
    } catch (e) {
    }
  }

  await page.click('text=Por Profesional');
  await page.locator("[name='professionalSearch']").fill("malagelada")
  await page.click('text=Malagelada');
  await page.click('text=Siguiente');
  await page.click('text=NO, ya estoy en un proceso médico');
  await page.click('text=Consulta Sucesiva');
  await page.click('text=Telefónica');
  await page.click('text=Siguiente');
  await page.click('text=Tengo seguro médico');
  await page.click('text=ADESLAS');
  await page.click('text=POLIZA/COLECTIVOS PRIVADOS');
  await page.click('text=Continuar');
  await page.click('text=Mujer');
  await page.locator("[name='edad']").fill("25");
  await page.click('text=Ver fechas');

  const firstGap = await page.locator('.hour-button.isFirstGap').first();
  const hourId = await firstGap.getAttribute('id');

  const dateTimeStr = hourId.slice(20); // "25/07/2025_12:45"
  console.log('🕒 Premier créneau:', dateTimeStr);

  const lastDateStr = getLastDate();

  if (!lastDateStr) {
    console.log('Aucune date précédente trouvée, enregistrement...');
    saveNewDate(dateTimeStr);
  } else {
    const newDate = parseDate(dateTimeStr);
    const lastDate = parseDate(lastDateStr);

    if (newDate < lastDate) {
      console.log('Nouveau créneau plus tôt détecté ! Envoi du mail...');
      await sendMail(dateTimeStr);
      saveNewDate(dateTimeStr);
    } else {
      console.log('Pas de nouveau créneau plus tôt.');
    }
  }
  
  await browser.close();
})();
