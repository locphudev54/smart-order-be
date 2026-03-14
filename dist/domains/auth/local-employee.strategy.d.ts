import { Strategy } from 'passport-local';
import { AuthService } from 'domains/auth/auth.service';
import { AccountType } from 'core/types/type';
declare const LocalEmployeeStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalEmployeeStrategy extends LocalEmployeeStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(email: string, password: string): Promise<AccountType>;
}
export {};
