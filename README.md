# Cita Checker

This script checks for earlier medical appointment slots on the QuirónSalud website and notifies you when a better one is found.

## Setup

1. **Clone the project:**

   ```bash
   git clone https://github.com/your-username/cita-checker.git
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
