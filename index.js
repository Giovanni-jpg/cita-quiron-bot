const { overrideConsole } = require('./lib/logToFile');
overrideConsole(); // Capture all console logs/errors

const { fetchAppt } = require('./scripts/fetch-appointments');
const cron = require('node-cron');

cron.schedule('*/5 * * * * *', async () => {
  console.log(`RUNNING CRON JOB`);
  try {
    await fetchAppt();
    console.log(`CRON JOB COMPLETED`);
  } catch (error) {
    console.error(`Task failed:`, error);
  }
});
