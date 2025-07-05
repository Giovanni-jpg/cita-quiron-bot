# Cita Checker

This script automates the check for earlier available medical appointments on the QuirónSalud website. It searches by practitioner name, for a phone consultation, for a patient already in an ongoing medical process with a specific insurance plan.

## Setup

1. **Clone the project:**

   ```bash
   git clone https://github.com/your-username/cita-quiron-bot.git
   cd cita-checker
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

2. **Update your preferences:**

   Create `config/constants.js` (you can copy the example file) and fill in your details:

   ```js
   module.exports.config = {
     doctor: 'Dr. Name',
     insurance: 'Your Insurance',
     insurancePlan: 'Plan Name',
     gender: 'Hombre', // or 'Mujer'
     age: '24'
   };
   ```

## Run the script

To start the checker, run:

```bash
node index.js
```
