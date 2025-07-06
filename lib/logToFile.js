
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'cron-logs.txt');

function writeLog(type, message) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}\n`;

  fs.appendFileSync(LOG_FILE, formattedMessage);

  // Optional: still print to console
  if (type === 'log') {
    process.stdout.write(formattedMessage);
  } else {
    process.stderr.write(formattedMessage);
  }
}

function overrideConsole() {
  console.log = (...args) => {
    writeLog('log', args.join(' '));
  };
  console.error = (...args) => {
    writeLog('error', args.join(' '));
  };
}

module.exports = { overrideConsole };
