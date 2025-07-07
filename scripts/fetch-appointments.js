const axios = require('axios');
const qs = require('qs');
require('dotenv').config();
const { config } = require('../config/constants');
const { getLastDate, saveNewDate } = require('../lib/storage');
const { notify } = require('../lib/notify');
const { log, formatDate, getTodayDateStr, getCurrentTime, parseDate } = require('./utils');

async function fetchAppt() {
  try {
    const headers = {
      accept: '*/*',
      'accept-language': 'fr-FR,fr;q=0.6',
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      origin: 'https://www.quironsalud.com',
      referer: 'https://www.quironsalud.com/es/cita-medica',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
      'x-proxia-csrf': process.env.QUIRON_CSRF,
      'x-dtpc': '5$309541963_646h47vPQSWQWSOMKAPKHMGPRNQUIOBUUCUUBBD-0e0',
      'x-dtreferer': 'https://www.quironsalud.com/es/cita-medica',
      'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sec-gpc': '1',
      cookie: process.env.QUIRON_COOKIES, // full cookie string from cURL (in network tab right click the request and copy as cURL)
    };

    const payload = qs.stringify({
      codCitacion: 1,
      idCentro: config.idCentro,
      codCentroAsociado: config.codCentroAsociado,
      idPrestacion: config.idPrestacion,
      idGarante: 5,
      idEspecialidad: 31,
      idGestion: config.idGestion,
      financialType: 1,
      garanteHIS: false,
      espPresHIS: false,
      fechaInicio: getTodayDateStr(),
      idProvincia: 8,
      idProfesionalPdP: 2186,
      edad: 25,
      isProtocolosChatBot: false,
      isLast: false,
      tipoBusqueda: 'SIMPLE',
      horaInicio: getCurrentTime(),
    });

    const response = await axios.post(
      'https://www.quironsalud.com/idcsalud-client/cm/quironsalud/pdp-api/v1/citas/huecos',
      payload,
      { headers }
    );
    const appointments = response.data;

    if (appointments.length > 0) {
      const first = appointments[0];
      const dateTimeStr = `${first.fechaCitaStr}_${first.horaCitaStr}`;
      log('FIRST SLOT', dateTimeStr);

      const lastDateStr = getLastDate();
      if (!lastDateStr) {
        log(
          'No data found in lastAppointment.txt, saving this slot as the earliest one...'
        );
        saveNewDate(dateTimeStr);
      } else {
        if (parseDate(dateTimeStr) < parseDate(lastDateStr)) {
          log(
            '********SUCCESS! Sending notification********'
          );
          const messageDate = formatDate(dateTimeStr);
          await notify(messageDate);
          saveNewDate(dateTimeStr);
        } else {
          log(
            'FAIL, KEEPING PREVIOUS:',
            lastDateStr
          );
        }
      }
    } else {
      log('No available appointments found.');
    }
  } catch (err) {
    console.error('Request failed:', err.response?.data || err.message);
  }
};

module.exports = { fetchAppt };



