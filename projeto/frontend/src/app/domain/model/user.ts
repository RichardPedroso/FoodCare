import { UserRole } from "./user-role";

export interface User {
    id?: string,
    name: string,
    email: string,
    password: string,
    role: UserRole
}
