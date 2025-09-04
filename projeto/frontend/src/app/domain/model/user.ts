export interface User {
    id?: string,
    name: string,
    email: string,
    password: string,
    phone: string,
    user_type: string,
    family_income?: string,
    people_quantity?: string,
    municipality_id: string,
    has_children?: boolean,
    documents?: string[],
    able?: boolean
}
