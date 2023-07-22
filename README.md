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
const set = carder.generate_set(2)
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

## Parameters
1. `new CreditCardGenerator()`
Create a new instance of the CreditCardGenerator class.
```ts
(alias) new CreditCardGenerator(encryption_key?: string | null | undefined, cc_presents?: Object<ICCPreset> | null | undefined, service_code?: number | undefined, log_in_console?: boolean | undefined): CreditCardGenerator
```
- `encryption_key`  - This parameter is the encryption key that will be used to generate the CVV2 code
- `cc_presents`     - This parameter is an object that contains credit card vendors with prefixes and digits length (`ICCPreset` interface)
- `service_code`    - This parameter is the service code that will be used to generate the credit card number
- `log_in_console`  - This parameter specifies whether or not the function should log its output to the console

2. `.generate_one()`
Generate a single credit card.
```ts
(method) CreditCardGenerator.generate_one(type?: CreditCardTypes | undefined): ICreditCard
```
- `type`            - Type of credit card to be used

3. `.generate_set`
Generate a set of credit cards.
```ts
(method) CreditCardGenerator.generate_set(size: number, type?: CreditCardTypes | undefined): Set<ICreditCard>
```
- `size`            - Batch size
- `type`            - Type of credit card to be used

4. `CreditCardGenerator.check_sum()`
Check if a credit card is valid with respect to the Luhn algorithm.
```ts
(method) CreditCardGenerator.check_sum(number: string): boolean
```
- `number`          - Credit card number to be validated