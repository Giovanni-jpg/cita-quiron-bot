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

module.exports = { log, formatDate };
