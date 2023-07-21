# Credit Card Generator

A Node.js package that generates valid credit card numbers, expiry dates, and CVV2 codes. The credit card numbers are valid with respect to the Luhn algorithm, and the CVV2 codes are generated using the Tripple-DES algorithm with double length keys.

## Installation
To install the credit-card-generator package, run the following command:
```bash
npm install @mihnea.dev/credit-card-generator
```

## Usage
To generate a credit card number, expiry date, and CVV2 code, use the following code:
```js
const { default: CreditCardGenerator } = require("@mihnea.dev/credit-card-generator");
/** Initialize new Credit Card Generator */
const carder = new CreditCardGenerator()
/** Create a single card */
const card = carder.generate_one()
/** Create a set of cards */
const set = carder.generate_set(1)
/** Log the results */
console.log(card, '\n', set)
```
This will output:
```bash
{
  number: '4532355776740539',
  expiry: { month: '01', year: '27' },
  cvv2: '510'
} 
 Set(2) {
  {
    number: '4916384806334101',
    expiry: { month: '11', year: '27' },
    cvv2: '040'
  },
  {
    number: '4539505711626762',
    expiry: { month: '04', year: '27' },
    cvv2: '564'
  }
}
```