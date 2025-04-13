import { User } from "src/users/models/user.entity";

export interface RegisterDto {
    user: User
}

export interface ConfirmDto {
    code: number,
    email: string,
}

export interface LoginDto {
    email: string,
    password: string
}
