export interface Product {
    id?: string;
    name: string;
    productType: string;
    category_id: string;
    measure_type: string;
    unitType?: string;
    optionsDonation?: number[];
}