import { Role } from 'core/constants/enum';
export declare class CreateAccountDto {
    email: string;
    password: string;
    fullName: string;
    avatarUrl?: string;
    role?: Role;
}
