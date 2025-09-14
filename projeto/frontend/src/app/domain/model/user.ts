export interface User {
    id?: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    userType: string,
    familyIncome?: number,
    peopleQuantity?: number,
    municipalityId: number,
    hasChildren?: boolean,
    numberOfChildren?: number,
    documents?: string[],
    images?: string[],
    able?: boolean,
    // Mantendo compatibilidade com código existente
    user_type?: string,
    family_income?: string,
    people_quantity?: string,
    municipality_id?: string,
    has_children?: boolean
}
