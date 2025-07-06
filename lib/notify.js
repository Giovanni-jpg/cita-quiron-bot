require("dotenv").config();
const { log } = require('../scripts/utils');
const Push = require("pushover-notifications");

const push = new Push({
  user: process.env.PUSHOVER_USER_KEY,
  token: process.env.PUSHOVER_APP_TOKEN,
});

async function notify(dateTime) {
  const msg = {
    message: `New earlier appointment available: ${dateTime}`,
    title: "Cita Quiron Bot Alert",
    priority: 1, // High priority
    url: "https://www.quironsalud.com/es/cita-medica#r!/n!/1?dir=none", // Optional URL to open
    url_title: "Click to Book Appointment", // Optional title for the URL
    //device: process.env.DEVICE_NAME, // specify a device if you have multiple
  };

  return new Promise((resolve, reject) => {
    push.send(msg, function (err, result) {
      if (err) {
        console.error("Failed to send notification:", err);
        return reject(err);
      }
      log("Notification sent:", result);
      resolve(result);
    });
  });
}

module.exports = { notify };
