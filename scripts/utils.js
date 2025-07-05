function log(message) {
  console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
}

module.exports = { log };
