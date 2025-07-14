export interface DonationProduct {
    id?: string,
    quantity: number,
    expirationDate: Date,
    unit: string,
    donation_id: string,
    product_id: string
}