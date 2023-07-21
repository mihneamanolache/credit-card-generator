import dotenv from "dotenv";
import { expect } from "chai";
import CreditCardGenerator from "../src/CreditCardGenerator";
import CreditCardTypes from "../src/types/CreditCardTypes";
import CCPresents from "../src/constants/presets";

dotenv.config();
const carder = new CreditCardGenerator();

describe("Credit Card Generator works", function () {
    for (const card in CreditCardTypes) {
        it(`Single ${card} has valid format`, function () {
            //@ts-ignore
            const single_card = carder.generate_one(CreditCardTypes[card]);
            expect(single_card).to.have.keys("number", "expiry", "cvv2");
            expect(single_card.number.length).to.equal(
                CCPresents[card].digit_len
            );
            expect(single_card.cvv2.length).to.equal(3);
            expect(single_card.expiry.month.length).to.equal(2);
            expect(single_card.expiry.year.length).to.equal(2);
        });
    }
    it("Can generate sets", function () {
        const set = carder.generate_set(10);
        expect(set.size).to.equal(10);
    });
});

describe("Check sum is valid", function () {
    for (const card in CreditCardTypes) {
        it(`${card} has valid check sum`, function () {
            //@ts-ignore
            const single_card = carder.generate_one(CreditCardTypes[card]);
            expect(CreditCardGenerator.check_sum(single_card.number)).to.equal(
                true
            );
        });
    }
});

describe("Third party validates card", function () {
    for (const card in CreditCardTypes) {
        it(`${card} is valid on apistacks`, async function () {
            this.timeout(60000);
            //@ts-ignore
            const single_card = carder.generate_one(CreditCardTypes[card]);
            const validator: any = await (
                await fetch(
                    `https://api.apistacks.com/v1/validatecard?api_key=${process.env.API_STACKS}&cardnumber=${single_card.number}`
                )
            ).json();
            expect(validator.status).to.equal("ok");
            card === "Amex"
                ? expect(validator.data.type).to.equal("american-express")
                : expect(validator.data.type).to.equal(card.toLowerCase());
        });
    }
});
