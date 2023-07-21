import { expect } from "chai";
import CreditCardGenerator from "../src/CreditCardGenerator";

describe("Errors are thrown", function () {
    it("Invalid key is provided", function () {
        try {
            const carder = new CreditCardGenerator("1234abcd")
            expect.fail('Invalid key error thrown.');
        } catch (e:any) {
            expect(e.message).to.equal('Invalid encryption key. Please pass a 32 hex characters key leave blank.');
        }
    })
    it("Invalid service code is provided", function () {
        try {
            const carder = new CreditCardGenerator(null, null, 999, false)
            expect.fail('Invalid service code error thrown.');
        } catch (e:any) {
            expect(e.message).to.include('Invalid service code. Service code should have 3 digits and have values:');
        }
    })
});
