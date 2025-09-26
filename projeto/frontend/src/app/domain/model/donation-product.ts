export interface DonationProduct {
    id?: string,
    quantity: number,
    expirationDate: Date,
    unit: number,
    donationId: string,
    productId: string
}