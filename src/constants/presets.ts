export type Object<T> = {
    [key: string]: T;
};

export interface ICCPreset {
    digit_len: number;
    prefixes: string[];
}

const CCPresents: Object<ICCPreset> = {
    VISA: {
        digit_len: 16,
        prefixes: ["4539", "4556", "4916", "4532", "4929", "4485", "4716", "4"],
    },
    MasterCard: {
        digit_len: 16,
        prefixes: ["51", "52", "53", "54", "55"],
    },
    Amex: {
        digit_len: 15,
        prefixes: ["34", "37"],
    }
};

export default CCPresents;
