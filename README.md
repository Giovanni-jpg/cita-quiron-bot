# Cita Checker

This project automates checking for earlier available medical appointments on the QuirónSalud website in Barcelona. It sends a carefully crafted HTTP POST request using Axios to query appointment slots and notifies via Pushover if an earlier slot than the saved one is found. The tool is intended for personal convenience and is not affiliated with QuirónSalud. I'm personally configuring it to run every 20 minutes using a cron job on my machine.

Originally, a Playwright-based scraper was used to navigate the site, but due to bot blockers, that approach became unreliable. The Playwright code remains in the repo as a fun reference, while the current solution relies on Axios to directly query the appointment API.


## Setup

1. **Clone the project:**

   ```bash
   git clone https://github.com/your-username/cita-quiron-bot.git
   cd cita-quiron-bot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Configuration

1. **Set your latest known appointment:**

   Create the `lastAppointment.txt` file and paste the last appointment you currently have in this format:

   ```
   25/07/2025_12:45
   ```

2. **Update your preferences and API parameters:**

   Create `config/constants.js` (you can copy the example file) and fill in your details, including the specific IDs and codes required by the QuirónSalud API (get those from the website network requests or your browser's developer tools):

   ```js
   module.exports.config = {
     idCentro: '034081100',
     codCentroAsociado: '034081199',
     idPrestacion: '20672.00',
     idGestion: 210755401,
     // other config values as needed
   };
   ```

3. **Set your environment variables:**

   Create a `.env` file in the root with your required sensitive data (get these from your browser's developer tools):

   ```
   QUIRON_CSRF=your_csrf_token_here
   QUIRON_COOKIES=your_full_cookie_string_here
   ```

## Run the script

To start the checker, run:

```bash
node index.js
```

This will send a request to the appointment API every 20 minutes, process the response, and notify you if an earlier appointment slot is found compared to the one saved in `lastAppointment.txt`.

To change the frequency of execution, open `index.js` and update the string pattern at the 7th line:

```
cron.schedule('*/20 * * * *', async () => {
```

Further documentation on how to set that pattern based on your needs can be found here: https://github.com/node-cron/node-cron and here: https://linux.die.net/man/5/crontab
