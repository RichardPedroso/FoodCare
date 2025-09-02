export interface UpdateUserDto {
    id?: number;
    name: string;
    email: string;
    phone: string;
    user_type: string;
    family_income?: number;
    people_quantity?: number;
    municipality_id: number;
    has_children?: boolean;
}