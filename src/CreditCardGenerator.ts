import * as CryptoJS from "crypto-js";

import CCPresents, { ICCPreset, Object } from "./constants/presets";
import service_codes from "./constants/service_codes";
import CreditCardTypes from "./types/CreditCardTypes";
import ICreditCard, { IExpiryDate } from "./types/ICreditCard";
import { Hex32 } from "./types/Misc";

export default class CreditCardGenerator {
    private encryption_key: Hex32;
    private cc_presents: Object<ICCPreset>;
    private service_code: number;
    private log_in_console: boolean;

    public constructor(
        encryption_key: Hex32 | null = null,
        cc_presents: Object<ICCPreset> | null = null,
        service_code: number = 201,
        log_in_console: boolean = false
    ) {
        this.log_in_console = log_in_console;
        if (encryption_key === null) {
            encryption_key = this.generate_encryption_key();
        }
        if (encryption_key && encryption_key.length !== 32) {
            throw new Error(
                "Invalid encryption key. Please pass a 32 hex characters key leave blank."
            );
        }
        if (cc_presents === null) {
            cc_presents = CCPresents;
        }
        if (!service_codes.includes(service_code)) {
            throw new Error(
                "Invalid service code. Service code should have 3 digits and have values: " +
                    service_codes
            );
        }
        this.encryption_key = encryption_key;
        this.cc_presents = cc_presents;
        this.service_code = service_code;
    }

    public generate_one(
        type: CreditCardTypes = CreditCardTypes.VISA
    ): ICreditCard {
        let cc_number = this.generate_cc_number(type);
        while (!CreditCardGenerator.check_sum(cc_number)) {
            cc_number = this.generate_cc_number(type);
        }
        const expiry = this.generate_expiry_date();
        return {
            number: cc_number,
            expiry: expiry,
            cvv2: this.generate_cvv2(cc_number, expiry),
        };
    }

    public generate_set(
        size: number,
        type: CreditCardTypes = CreditCardTypes.VISA
    ): Set<ICreditCard> {
        const set: Set<ICreditCard> = new Set();
        while (set.size < size) {
            set.add(this.generate_one(type));
        }
        return set;
    }

    private generate_cc_number(type: CreditCardTypes) {
        let cc_number =
            this.cc_presents[type].prefixes[
                Math.floor(
                    Math.random() * this.cc_presents[type].prefixes.length
                )
            ];
        while (cc_number.length < this.cc_presents[type].digit_len - 1) {
            cc_number += Math.floor(Math.random() * 10);
        }
        const isEven = (number: number) => number % 2 === 0;
        const calculateEven = (even: number) =>
            even * 2 < 10 ? even * 2 : even * 2 - 9;
        const checksum =
            cc_number
                .split("")
                .map((number, index) =>
                    isEven(index)
                        ? calculateEven(parseInt(number))
                        : parseInt(number, 10)
                )
                .reduce((previous, current) => previous + current) % 10;

        cc_number += checksum === 0 ? 0 : 10 - checksum;
        return cc_number;
    }

    private generate_expiry_date(year: number | null = null): IExpiryDate {
        const currentYear = year !== null ? year : new Date().getFullYear();
        const expiryYear = ((currentYear % 100) + 4).toString();
        const expiryMonth = (Math.floor(Math.random() * 12) + 1).toString();
        return {
            month: expiryMonth.length < 2 ? "0" + expiryMonth : expiryMonth,
            year: expiryYear,
        };
    }

    private generate_cvv2(cc_number: string, expiry: IExpiryDate): string {
        let data = cc_number + expiry.month + expiry.year + this.service_code;
        while (data.length < 32) {
            data += 0;
        }
        const split_key = {
            first: this.encryption_key.slice(0, 16),
            second: this.encryption_key.slice(16, 32),
        };
        const split_data = {
            first: data.slice(0, 16),
            second: data.slice(16, 32),
        };
        /** Encrypt (DES) the first half of the data with the first half of the key */
        let first_step = this.encrypt_DES(split_data.first, split_key.first);
        /** XOR the result with the second half of data */
        let second_step = this.xor(first_step, split_data.second);
        /** Encrypt (DES) the result with the first half of the Key */
        let third_step = this.encrypt_DES(second_step, split_key.first);
        /** Decrypt (DES) the result with the second half of the key */
        const fourth_step = this.decrypt_DES(third_step, split_key.second);
        /**  Encrypt (DES) the result with the first half of the key */
        const fifth_step = this.encrypt_DES(fourth_step, split_key.first);
        return fifth_step.replace(/\D/g, "").slice(0, 3);
    }

    protected encrypt_DES(data: string, key: string): string {
        const keyWordArray = CryptoJS.enc.Utf8.parse(key);
        const dataWordArray = CryptoJS.enc.Utf8.parse(this.pad_data(data));
        const encryptedData = CryptoJS.DES.encrypt(
            dataWordArray,
            keyWordArray,
            {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.NoPadding,
            }
        );
        return encryptedData.ciphertext.toString(CryptoJS.enc.Hex);
    }

    protected decrypt_DES(data: string, key: string): string {
        const keyWordArray = CryptoJS.enc.Utf8.parse(key);
        const decryptedData = CryptoJS.DES.decrypt(data, keyWordArray, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.NoPadding,
        });
        return decryptedData.toString();
    }

    protected pad_data(data: string): string {
        const blockSize = 8;
        if (data.length < blockSize) {
            return data.padEnd(blockSize, "\0");
        } else if (data.length > blockSize) {
            return data.slice(0, blockSize);
        }
        return data;
    }

    protected hexToBinary(hex: string): string {
        return BigInt(`0x${hex}`)
            .toString(2)
            .padStart(hex.length * 4, "0");
    }

    protected binaryToHex(binary: string): string {
        return BigInt(`0b${binary}`).toString(16).toUpperCase();
    }

    protected xor(hex1: string, hex2: string): string {
        const binary1 = this.hexToBinary(hex1);
        const binary2 = this.hexToBinary(hex2);

        let resultBinary = "";
        for (let i = 0; i < binary1.length; i++) {
            resultBinary += binary1[i] === binary2[i] ? "0" : "1";
        }

        return this.binaryToHex(resultBinary);
    }

    public static check_sum(number: string): boolean {
        let sum = 0;
        let evenPlaces = false;
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = number.charAt(i);
            let value = parseInt(digit);
            if (evenPlaces) {
                value *= 2;
                if (value > 9) value = value - 9;
            }
            sum += value;
            evenPlaces = !evenPlaces;
        }
        return sum % 10 === 0;
    }

    private logger(info: any) {
        if (this.log_in_console === false) return;
        const output = `\x1b[32m[${new Date().toISOString()}]: ${info}\x1b[0m`;
        console.log(output);
    }

    private generate_encryption_key(): Hex32 {
        const hexDigits = "0123456789abcdefghijklmnopqrstuvwxyz";
        let hex32String = "";
        for (let _ = 0; _ < 32; _++) {
            hex32String +=
                hexDigits[Math.floor(Math.random() * hexDigits.length)];
        }
        this.logger(`Using generated encryption key: ${hex32String}`);
        return hex32String;
    }
}
