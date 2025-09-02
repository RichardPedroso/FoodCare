export interface Product {
    id?: string;
    name: string;
    productType: string;
    category_id: string;
    measure_type: string;
    options_donation?: string[];
}