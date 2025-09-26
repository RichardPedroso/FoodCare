export interface Product {
    id?: string;
    name: string;
    productType: string;
    categoryId: string;
    measureType: string;
    unitType?: string;
    optionsDonation?: number[];
}