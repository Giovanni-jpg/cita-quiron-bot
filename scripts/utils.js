function log(...args) {
  const logDateTime = new Date();
  console.log(`[${logDateTime.toDateString()} - ${logDateTime.toLocaleTimeString()}]`, ...args);
}


function monthName(monthNumber) {
  return [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ][monthNumber - 1];
}

function formatDate(dateTimeStr) {
  const [dateStr, timeStr] = dateTimeStr.split('_');
  const [day, month, year] = dateStr.split('/').map(Number);
  return `${day} ${monthName(month)} ${year} at ${timeStr}`;
}

function getTodayDateStr() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}${minutes}${seconds}`;
}


module.exports = { log, formatDate, getTodayDateStr, getCurrentTime };
