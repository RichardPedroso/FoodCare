import { UserRole } from "./user-role";

export interface User {
    id? : string,
    fullname: string,
    email: string,
    password: string,
    role: UserRole

}
