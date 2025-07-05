const { fetchAppt } = require('./scripts/fetch-appointments');

(async () => {
  await fetchAppt();
})();
