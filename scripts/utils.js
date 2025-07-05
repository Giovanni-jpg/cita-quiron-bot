function log(...args) {
  const logDateTime = new Date();
  console.log(`[${logDateTime.toDateString()} - ${logDateTime.toLocaleTimeString()}]`, ...args);
}

module.exports = { log };
