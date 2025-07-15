export interface Product {
    id?: string,
    name: string,
    productType: string,
    stock: number,
    isActive: boolean,
    basketQuantity: number,
    category_id: string
}