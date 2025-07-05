const fs = require('fs');
const path = require('path');
const STORAGE_FILE = path.join(__dirname, '..', 'lastAppointment.txt');

function getLastDate() {
  if (!fs.existsSync(STORAGE_FILE)) return null;
  return fs.readFileSync(STORAGE_FILE, 'utf-8').trim();
}

function saveNewDate(date) {
  fs.writeFileSync(STORAGE_FILE, date);
}

module.exports = { getLastDate, saveNewDate };
