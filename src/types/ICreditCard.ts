export interface IExpiryDate { 
    month: string,
    year: string
}

export default interface ICreditCard {
    number: string,
    expiry: IExpiryDate,
    cvv2: string
}